export interface OrderModel {
  description?: string;
  orderNumber?: string;
  orderStatus?: number;
  finalAmount?: number;
  deliveryName?: string;
  shipmentPrice?: number;
  discountPrice?: number;
  isSuccess?: boolean;
  address?: string;
  createDate?: string;
}
