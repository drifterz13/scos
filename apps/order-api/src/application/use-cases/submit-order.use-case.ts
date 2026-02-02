import { Order } from "../../domain/entities/order.entity";
import type { IOrderRepository } from "../../domain/repositories/order.repository.interface";
import { Coordinates } from "../../domain/value-objects/coordinates.vo";
import { Discount } from "../../domain/value-objects/discount.vo";
import { Money } from "../../domain/value-objects/money.vo";
import { Quantity } from "../../domain/value-objects/quantity.vo";
import type { OrderResponseDto } from "../dto/order-response.dto";
import type { PublishInventoryUpdateUseCase } from "./publish-inventory-update.use-case";
import type { VerifyOrderUseCase } from "./verify-order.use-case";

export class SubmitOrderUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private publishInventoryUpdateUseCase: PublishInventoryUpdateUseCase,
    private verifyOrderUseCase: VerifyOrderUseCase,
  ) {}

  async execute(request: {
    quantity: number;
    shippingLatitude: number;
    shippingLongitude: number;
  }): Promise<OrderResponseDto> {
    const verification = await this.verifyOrderUseCase.execute(request);

    if (!verification.isValid) {
      throw new Error(verification.validationMessage || "Order is invalid");
    }

    const coordinates = Coordinates.fromObject({
      latitude: request.shippingLatitude,
      longitude: request.shippingLongitude,
    });
    const quantity = new Quantity(request.quantity);
    const unitPrice = Money.fromDollars(verification.orderPreview.unitPrice);
    const discount = new Discount(verification.orderPreview.discountPercentage);
    const shippingCost = Money.fromDollars(verification.orderPreview.totalShippingCost);

    const order = Order.create(coordinates, quantity, unitPrice, discount, shippingCost);

    const orderNumber = await this.orderRepository.getNextOrderNumber();
    order.setOrderNumber(orderNumber);
    order.submit();

    const savedOrder = await this.orderRepository.save(order);

    const inventoryUpdates = verification.fulfillmentPlan.map((plan) => ({
      warehouseId: plan.warehouseId,
      quantity: plan.quantity,
    }));
    await this.publishInventoryUpdateUseCase.execute({
      orderId: order.id,
      orderNumber: String(order.orderNumber),
      updates: inventoryUpdates,
    });

    return this.toDto(savedOrder, verification.orderPreview.totalDiscountAmount);
  }

  private toDto(order: Order, totalDiscountAmount: number): OrderResponseDto {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      shippingLatitude: order.shippingCoordinates.latitude,
      shippingLongitude: order.shippingCoordinates.longitude,
      quantity: order.quantity.value,
      unitPriceAtTime: order.unitPriceAtTime.toDollars(),
      discountPercentage: order.discount.percentage,
      totalDiscountAmount,
      totalShippingCost: order.shippingCost.toDollars(),
      totalPrice: order.totalPrice.toDollars(),
      status: order.status,
    };
  }
}
