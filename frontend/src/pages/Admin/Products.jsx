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
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  // Product form state
  const [productForm, setProductForm] = useState({
    title: "",
    description: "",
    brand: "",
    price: "",
    stock: "",
    category: "",
    images: [],
  });

  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
  });

  // Fetch categories
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

  // Fetch products
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

  // Handle add category
  const handleAddCategory = async (e) => {
    e.preventDefault();
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

  // Handle add product
  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", productForm.title);
      formData.append("description", productForm.description);
      formData.append("brand", productForm.brand);
      formData.append("price", productForm.price);
      formData.append("stock", productForm.stock);
      formData.append("category", productForm.category);

      // Multiple images
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

  // Handle Delete Product
  const handleDeleteProduct = async (id) => {
    try {
      await api.delete(`/api/v1/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      toast.success("Product deleted successfully");
      fetchProducts(); // refresh the table
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 dark:bg-black h-screen rounded-2xl">
        <h1 className="font-bold text-xl">Products</h1>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3">
        <Input placeholder="Search products..." className="w-full md:w-1/3" />
        <div className="flex gap-2 w-full md:w-auto">
          {/* Add Category */}
          <Dialog open={openCategory} onOpenChange={setOpenCategory}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto">Add Category</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddCategory} className="space-y-4 mt-4">
                <Input
                  placeholder="Category Name"
                  value={categoryForm.name}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, name: e.target.value })
                  }
                />
                <Input
                  placeholder="Slug"
                  value={categoryForm.slug}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, slug: e.target.value })
                  }
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
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
              <Button className="w-full md:w-auto">Add Product</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddProduct} className="space-y-4 mt-4">
                <Input
                  placeholder="Title"
                  value={productForm.title}
                  onChange={(e) =>
                    setProductForm({ ...productForm, title: e.target.value })
                  }
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
                />
                <Input
                  type="number"
                  placeholder="Stock"
                  value={productForm.stock}
                  onChange={(e) =>
                    setProductForm({ ...productForm, stock: e.target.value })
                  }
                />

                {/* Category Select */}
                <Select
                  className="w-full"
                  value={productForm.category}
                  onValueChange={(val) =>
                    setProductForm({ ...productForm, category: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-gray-500 text-sm">
                        No categories available
                      </div>
                    )}
                  </SelectContent>
                </Select>

                {/* Multiple Images */}
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
      <div className="bg-white dark:bg-black rounded-lg shadow p-4 overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Title</th>
              <th className="p-2 text-left">Brand</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Stock</th>
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-left">Images</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b">
                <td className="p-2">{p.title}</td>
                <td className="p-2">{p.brand}</td>
                <td className="p-2">${p.price}</td>
                <td className="p-2">{p.stock}</td>
                <td className="p-2">{p.category?.name || "-"}</td>
                <td className="p-2 flex gap-2">
                  {p.images?.slice(0, 2).map((img, idx) => (
                    <img
                      key={idx}
                      src={img.url || img}
                      alt="product"
                      className="w-10 h-10 rounded object-cover"
                    />
                  ))}
                  {p.images?.length > 2 && (
                    <span className="text-xs text-gray-500">
                      +{p.images.length - 2} more
                    </span>
                  )}
                </td>
                <td>
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
    </div>
  );
}
