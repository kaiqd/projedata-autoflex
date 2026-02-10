/*  Product  */

export interface Product {
  id: string;
  code: string;
  name: string;
  price: number;
}

export interface ProductRequest {
  code: string;
  name: string;
  price: number;
}

/*  Raw Material  */

export interface RawMaterial {
  id: string;
  code: string;
  name: string;
  stockQuantity: number;
}

export interface RawMaterialRequest {
  code: string;
  name: string;
  stockQuantity: number;
}

/*  Product Material (BOM)  */

export interface ProductMaterialItem {
  id: string;
  rawMaterialId: string;
  rawMaterialCode: string;
  rawMaterialName: string;
  requiredQuantity: number;
}

export interface ProductMaterialItemRequest {
  rawMaterialId: string;
  requiredQuantity: number;
}

/*  Production Suggestion  */

export interface ProductionSuggestionItem {
  productId: string;
  productCode: string;
  productName: string;
  unitPrice: number;
  suggestedQuantity: number;
  totalValue: number;
}

export interface ProductionSuggestionResponse {
  items: ProductionSuggestionItem[];
  totalValue: number;
}
