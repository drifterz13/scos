import { PRODUCT_CONSTANTS } from "../../domain/constants/product.constants";
import { Warehouse } from "../../domain/entities/warehouse.entity";
import { DiscountCalculatorDomainService } from "../../domain/services/discount-calculator.domain-service";
import { ShippingCalculatorDomainService } from "../../domain/services/shipping-calculator.domain-service";
import { Coordinates } from "../../domain/value-objects/coordinates.vo";
import { Quantity } from "../../domain/value-objects/quantity.vo";
import type { VerifyOrderRequestDto, VerifyOrderResponseDto } from "../dto/verify-order.dto";
import type { IWarehouseServiceClient, WarehouseDto } from "../interfaces/warehouse-service.client.interface";

export class VerifyOrderUseCase {
  constructor(private warehouseServiceClient: IWarehouseServiceClient) {}

  async execute(request: VerifyOrderRequestDto): Promise<VerifyOrderResponseDto> {
    const quantity = new Quantity(request.quantity);
    const coordinates = Coordinates.fromObject({
      latitude: request.shippingLatitude,
      longitude: request.shippingLongitude,
    });

    const warehouseDtos = await this.warehouseServiceClient.getAllWarehouses();
    const warehouses = warehouseDtos.map((dto) => this.toWarehouse(dto));

    const discount = DiscountCalculatorDomainService.calculate(quantity.value);
    const fulfillmentPlan = ShippingCalculatorDomainService.calculateOptimalFulfillment(
      warehouses,
      coordinates,
      quantity.value,
    );
    const totalShippingCost = ShippingCalculatorDomainService.calculateTotalShippingCost(fulfillmentPlan);

    const unitPrice = PRODUCT_CONSTANTS.BASE_PRICE;
    const subtotal = unitPrice.multiply(quantity.value);
    const discountAmount = subtotal.applyPercentage(discount.percentage);
    const orderAmount = subtotal.subtract(discountAmount);
    const totalPrice = orderAmount.add(totalShippingCost);

    const maxShippingCost = orderAmount.applyPercentage(PRODUCT_CONSTANTS.MAX_SHIPPING_COST_PERCENTAGE);
    const isValid = totalShippingCost.lessThanOrEqual(maxShippingCost);

    return {
      orderPreview: {
        unitPrice: unitPrice.toDollars(),
        quantity: quantity.value,
        discountPercentage: discount.percentage,
        totalDiscountAmount: discountAmount.toDollars(),
        totalShippingCost: totalShippingCost.toDollars(),
        totalPrice: totalPrice.toDollars(),
      },
      fulfillmentPlan: fulfillmentPlan.map((plan) => ({
        warehouseId: plan.warehouseId,
        warehouseName: plan.warehouseName,
        quantity: plan.quantity,
        distance: Number(plan.distance.toFixed(2)),
        shippingCost: plan.shippingCost.toDollars(),
      })),
      isValid,
      validationMessage: isValid
        ? undefined
        : `Shipping cost ($${totalShippingCost.toDollars().toFixed(2)}) exceeds 15% of order amount ($${orderAmount.toDollars().toFixed(2)})`,
    };
  }

  private toWarehouse(dto: WarehouseDto): Warehouse {
    return new Warehouse(
      dto.id,
      dto.name,
      Coordinates.fromObject({
        latitude: dto.latitude,
        longitude: dto.longitude,
      }),
      dto.stockQuantity,
    );
  }
}
