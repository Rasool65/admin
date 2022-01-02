export interface Istatistic {
  totalUser?: number;
  totalProduct?: number;
  totalOrder?: number;
  totalBlog?: number;
  totalRevenue?: number;
}

export interface IDashboard {
  customerCount?: [];
  productCount?: [];
  orderCount?: [];
  latestOrders?: [];
  weeklySailedOrders?: [];
}

export const enum ProductStatus {
  Canceled = 1,
  Pending = 2,
  Approved = 3,
  Posted = 4,
  Delivered = 5,
  InBasket = 6,
  ReadyForPay = 7,
}
