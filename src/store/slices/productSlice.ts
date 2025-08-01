import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  stock: number;
  categoryId: string;
  featured: boolean;
  category?: {
    id: string;
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

interface ProductState {
  products: Product[];
  categories: Category[];
  featuredProducts: Product[];
  selectedCategory: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  categories: [],
  featuredProducts: [],
  selectedCategory: null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.featuredProducts = action.payload.filter(
        (product) => product.featured
      );
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
      if (action.payload.featured) {
        state.featuredProducts.push(action.payload);
      }
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;

        // Update featured products
        state.featuredProducts = state.products.filter(
          (product) => product.featured
        );
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
      state.featuredProducts = state.featuredProducts.filter(
        (p) => p.id !== action.payload
      );
    },
  },
});

export const {
  setProducts,
  setCategories,
  setSelectedCategory,
  setLoading,
  setError,
  addProduct,
  updateProduct,
  deleteProduct,
} = productSlice.actions;

export default productSlice.reducer;
