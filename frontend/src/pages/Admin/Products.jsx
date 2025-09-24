"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import api from "@/utils/api";

export default function Products() {
  const [openProduct, setOpenProduct] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const [productForm, setProductForm] = useState({
    title: "",
    description: "",
    brand: "",
    price: "",
    stock: "",
    category: "",
    images: [],
  });

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
  });

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/api/v1/category", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setCategories(data?.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch categories");
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/api/v1/products", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setProducts(data?.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      await api.post("/api/v1/category/create", categoryForm, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      toast.success("Category added");
      setOpenCategory(false);
      setCategoryForm({ name: "", slug: "" });
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add category");
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!productForm.title.trim()) return toast.error("Title is required");
    if (!productForm.price || productForm.price <= 0)
      return toast.error("Price must be greater than 0");
    if (!productForm.category) return toast.error("Category is required");

    try {
      const formData = new FormData();
      formData.append("title", productForm.title);
      formData.append("description", productForm.description);
      formData.append("brand", productForm.brand);
      formData.append("price", productForm.price);
      formData.append("stock", productForm.stock);
      formData.append("category", productForm.category);

      productForm.images.forEach((img) => {
        formData.append("images", img);
      });

      await api.post("/api/v1/products/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      toast.success("Product added successfully");
      setOpenProduct(false);
      setProductForm({
        title: "",
        description: "",
        brand: "",
        price: "",
        stock: "",
        category: "",
        images: [],
      });
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add product");
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await api.delete(`/api/v1/products/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  const openUpdateDialog = (product) => {
    setEditProduct(product);
    setProductForm({
      title: product.title,
      description: product.description,
      brand: product.brand,
      price: product.price,
      stock: product.stock,
      category: product.category?._id || "",
      images: [],
    });
    setOpenEdit(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!productForm.title.trim()) return toast.error("Title is required");
    if (!productForm.price || productForm.price <= 0)
      return toast.error("Price must be greater than 0");
    if (!productForm.category) return toast.error("Category is required");

    try {
      const formData = new FormData();
      formData.append("title", productForm.title);
      formData.append("description", productForm.description);
      formData.append("brand", productForm.brand);
      formData.append("price", productForm.price);
      formData.append("stock", productForm.stock);
      formData.append("category", productForm.category);

      productForm.images.forEach((img) => {
        formData.append("images", img);
      });

      await api.patch(`/api/v1/products/update/${editProduct._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      toast.success("Product updated successfully");
      setOpenEdit(false);
      setEditProduct(null);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update product");
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 dark:bg-black min-h-screen rounded-2xl">
      <h1 className="font-bold text-xl">Products</h1>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3">
        <Input
          placeholder="Search products..."
          className="w-full md:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2 flex-wrap">
          {/* Add Category */}
          <Dialog open={openCategory} onOpenChange={setOpenCategory}>
            <DialogTrigger asChild>
              <Button>Add Category</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <Input
                  placeholder="Category Name"
                  value={categoryForm.name}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, name: e.target.value })
                  }
                  required
                />
                <Input
                  placeholder="Slug"
                  value={categoryForm.slug}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, slug: e.target.value })
                  }
                  required
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setOpenCategory(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Add Product */}
          <Dialog open={openProduct} onOpenChange={setOpenProduct}>
            <DialogTrigger asChild>
              <Button>Add Product</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <Input
                  placeholder="Title"
                  value={productForm.title}
                  onChange={(e) =>
                    setProductForm({ ...productForm, title: e.target.value })
                  }
                  required
                />
                <Input
                  placeholder="Description"
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      description: e.target.value,
                    })
                  }
                  required
                />
                <Input
                  placeholder="Brand"
                  value={productForm.brand}
                  onChange={(e) =>
                    setProductForm({ ...productForm, brand: e.target.value })
                  }
                />
                <Input
                  type="number"
                  placeholder="Price"
                  value={productForm.price}
                  onChange={(e) =>
                    setProductForm({ ...productForm, price: e.target.value })
                  }
                  required
                />
                <Input
                  type="number"
                  placeholder="Stock"
                  value={productForm.stock}
                  onChange={(e) =>
                    setProductForm({ ...productForm, stock: e.target.value })
                  }
                  required
                />

                {/* Category Select */}
                <Select
                  value={productForm.category}
                  onValueChange={(val) =>
                    setProductForm({ ...productForm, category: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Images */}
                <Input
                  type="file"
                  multiple
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      images: Array.from(e.target.files),
                    })
                  }
                />

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setOpenProduct(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto bg-white dark:bg-black rounded-lg shadow p-4">
        <table className="w-full min-w-[600px] text-sm md:text-base">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Image</th>
              <th className="p-2 text-left">Title</th>
              <th className="p-2 text-left">Brand</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Stock</th>
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p._id} className="border-b">
                <td className="p-2">
                  <img
                    src={p.images?.[0]?.url || "/placeholder.jpg"}
                    alt={p.title}
                    className="w-12 h-12 rounded object-cover"
                  />
                </td>
                <td className="p-2">{p.title}</td>
                <td className="p-2">{p.brand}</td>
                <td className="p-2">${p.price}</td>
                <td className="p-2">{p.stock}</td>
                <td className="p-2">{p.category?.name || "-"}</td>
                <td className="p-2 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openUpdateDialog(p)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteProduct(p._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateProduct} className="space-y-4">
            <Input
              placeholder="Title"
              value={productForm.title}
              onChange={(e) =>
                setProductForm({ ...productForm, title: e.target.value })
              }
              required
            />
            <Input
              placeholder="Description"
              value={productForm.description}
              onChange={(e) =>
                setProductForm({ ...productForm, description: e.target.value })
              }
              required
            />
            <Input
              placeholder="Brand"
              value={productForm.brand}
              onChange={(e) =>
                setProductForm({ ...productForm, brand: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Price"
              value={productForm.price}
              onChange={(e) =>
                setProductForm({ ...productForm, price: e.target.value })
              }
              required
            />
            <Input
              type="number"
              placeholder="Stock"
              value={productForm.stock}
              onChange={(e) =>
                setProductForm({ ...productForm, stock: e.target.value })
              }
              required
            />

            <Select
              value={productForm.category}
              onValueChange={(val) =>
                setProductForm({ ...productForm, category: val })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="file"
              multiple
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  images: Array.from(e.target.files),
                })
              }
            />

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => setOpenEdit(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Update</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
