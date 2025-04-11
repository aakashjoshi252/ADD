"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_PRODUCT } from "../../../graphql/mutations";
import { GET_PARENT_CATEGORIES, ME_QUERY } from "../../../graphql/queries";
import { GET_SUBCATEGORIES } from "../../../graphql/queries";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

type Variation = {
  size: string;
  color: string;
  price: number;
};

type AddProductFormInputs = {
  name: string;
  description: string;
  price: string;
  material: string;
  weight?: string;
  category: string;
  subcategory: string;
  variations?: Variation[];
};

export default function AddProduct() {
  const [addProduct] = useMutation(CREATE_PRODUCT);
  const { data: cdata, loading: cloading } = useQuery(ME_QUERY);
  const [selectedParentCategory, setSelectedParentCategory] = useState<string | null>(null);
  const { data: categoriesData, loading: categoriesLoading } = useQuery(GET_PARENT_CATEGORIES);
  const [errorMessage, setErrorMessage] = useState("");
  const [variations, setVariations] = useState<Variation[]>([]);

   
  const { data: subcategoriesData, loading: subcategoriesLoading } = useQuery(GET_SUBCATEGORIES, {
    variables: { parentCategoryId: selectedParentCategory },
    skip: !selectedParentCategory,
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AddProductFormInputs>();

  const addVariation = () => {
    setVariations([...variations, { size: "", color: "", price: 0 }]);
  };
  // apply session here

  const updateVariation = (index: number, field: keyof Variation, value: string | number) => {
    setVariations((prevVariations) =>
      prevVariations.map((variation, i) =>
        i === index
          ? {
              ...variation,
              [field]: field === "price" ? Number(value) : String(value),
            }
          : variation
      )
    );
  };

  const removeVariation = (index: number) => {
    setVariations(variations.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: AddProductFormInputs) => {
    try {
      const response = await addProduct({ 
        variables: { 
          input: {
            ...data,
            price: parseFloat(data.price),
            weight: data.weight ? parseFloat(data.weight) : undefined,
            variations,
          }
        } 
      });

      if (response.data?.createProduct?.id) {
        window.location.href = "/dashboard";
      } else {
        setErrorMessage(response.data?.createProduct?.errors?.[0]?.message || "Error");
      }
    } catch (err) {
      console.error("Error:", err); 
      setErrorMessage("An error occurred");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Add Product</h2>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input 
          type="text" 
          placeholder="Enter Product Name" 
          {...register("name", { required: "Product name is required" })} 
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.name && <p className="text-red-500 ">{errors.name.message}</p>}

        <input 
          type="text" 
          placeholder="Enter Description" 
          {...register("description", { required: "Description is required" })} 
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.description && <p className="text-red-500">{errors.description.message}</p>}

        <input 
          type="text" 
          placeholder="Enter Price" 
          {...register("price", { required: "Price is required" })} 
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.price && <p className="text-red-500">{errors.price.message}</p>}

        <input 
          type="text" 
          placeholder="Enter Material" 
          {...register("material", { required: "Material is required" })} 
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.material && <p className="text-red-500 text-sm mt-1">{errors.material.message}</p>}

        <input 
          type="text" 
          placeholder="Enter Weight (optional)" 
          {...register("weight")} 
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* Category Dropdown */}
        <select
          {...register("category", { required: "Category is required" })}
          className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          onChange={(e) => setSelectedParentCategory(e.target.value)} // Set selected parent category
        >
          <option value="">Select a Category</option>
          {categoriesLoading ? (
            <option disabled>Loading categories...</option>
          ) : (
            categoriesData?.parentCategories?.map((category: { id: string; name: string }) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))
          )}
        </select>

        {selectedParentCategory && (
          <select 
            {...register("subcategory", { required: "Subcategory is required" })}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select a Subcategory</option>
            {subcategoriesLoading ? (
              <option disabled>Loading subcategories...</option>
            ) : (
              subcategoriesData?.subcategories?.map((subcategory: { id: string; name: string }) => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </option>
              ))
            )}
          </select>
        )}     

        {errors.category && <p className="text-red-500">{errors.category.message}</p>}

        {/* Variations */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Product Variations</h3>
          {variations.map((variation, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input
                type="text"
                placeholder="Size"
                value={variation.size}
                onChange={(e) => updateVariation(index, "size", e.target.value)}
                className="w-1/3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="Color"
                value={variation.color}
                onChange={(e) => updateVariation(index, "color", e.target.value)}
                className="w-1/3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="Price"
                value={variation.price}
                onChange={(e) => updateVariation(index, "price", e.target.value)}
                className="w-1/3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={() => removeVariation(index)}
                className="text-red-600 font-semibold text-xl hover:scale-110 transition"
              >
                X
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addVariation}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Add Variation
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
