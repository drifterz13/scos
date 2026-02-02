import type { OrderResponseDto } from "../../application/dto/order-response.dto";
import type { VerifyOrderRequestDto, VerifyOrderResponseDto } from "../../application/dto/verify-order.dto";
import type { SubmitOrderUseCase } from "../../application/use-cases/submit-order.use-case";
import type { VerifyOrderUseCase } from "../../application/use-cases/verify-order.use-case";

export class OrdersController {
  constructor(
    private verifyOrderUseCase: VerifyOrderUseCase,
    private submitOrderUseCase: SubmitOrderUseCase,
  ) {}

  async verifyOrder(request: VerifyOrderRequestDto): Promise<VerifyOrderResponseDto> {
    return await this.verifyOrderUseCase.execute(request);
  }

  async submitOrder(request: VerifyOrderRequestDto): Promise<OrderResponseDto> {
    return await this.submitOrderUseCase.execute(request);
  }
}
