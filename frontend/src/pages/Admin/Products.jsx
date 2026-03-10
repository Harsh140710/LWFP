"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus, Search, Package, Layers, Edit3, Trash2,
  AlertCircle, Tag, ImageIcon
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  const [openBrand, setOpenBrand] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [productForm, setProductForm] = useState({
    title: "",
    description: "",
    brand: "", // Will store Brand ID
    price: "",
    stock: "",
    category: "", // Will store Category ID
    images: [],
  });

  const [categoryForm, setCategoryForm] = useState({ name: "", slug: "" });
  const [brandForm, setBrandForm] = useState({ name: "", slug: "" });

  // --- API CALLS ---

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/api/v1/products/category");
      setCategories(data?.data || []);
    } catch (error) { console.error("Category fetch failed"); }
  };

  const fetchBrands = async () => {
    try {
      const { data } = await api.get("/api/v1/products/brand");
      setBrands(data?.data || []);
    } catch (error) { console.error("Brand fetch failed"); }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/v1/products");
      setProducts(data?.data || []);
    } catch (error) {
      toast.error("Inventory fetch failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchBrands();
    fetchProducts();
  }, []);

  // --- HANDLERS ---

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/v1/products/category/create", categoryForm);
      toast.success("New Category archived");
      setOpenCategory(false);
      setCategoryForm({ name: "", slug: "" });
      fetchCategories();
    } catch (error) { toast.error("Failed to register category"); }
  };

  const handleAddBrand = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/v1/products/brand/create", brandForm);
      toast.success("Brand Registered");
      setOpenBrand(false);
      setBrandForm({ name: "", slug: "" });
      fetchBrands();
    } catch (error) { toast.error("Brand registration failed"); }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (productForm.images.length === 0) return toast.error("At least one image is required");

    try {
      const formData = new FormData();
      Object.keys(productForm).forEach(key => {
        if (key !== 'images') formData.append(key, productForm[key]);
      });
      productForm.images.forEach(file => formData.append("images", file));

      await api.post("/api/v1/products/create", formData);

      toast.success("Asset registered successfully");
      setOpenProduct(false);
      fetchProducts();
      setProductForm({ title: "", description: "", brand: "", price: "", stock: "", category: "", images: [] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      // Use a loop to append all standard fields from productForm
      Object.keys(productForm).forEach(key => {
        if (key !== 'images') {
          formData.append(key, productForm[key]);
        }
      });

      // Append new images if any were selected
      if (productForm.images && productForm.images.length > 0) {
        productForm.images.forEach(img => formData.append("images", img));
      }

      await api.patch(`/api/v1/products/update/${editProduct._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      toast.success("Asset ledger updated");
      setOpenEdit(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Permanent removal from ledger?")) return;
    try {
      await api.delete(`/api/v1/products/delete/${id}`);
      toast.success("Asset expunged");
      fetchProducts();
    } catch (error) { toast.error("Purge protocol failed"); }
  };

  const openUpdateDialog = (product) => {
    setEditProduct(product);
    setProductForm({
      title: product.title || "",
      description: product.description || "",
      brand: product.brand?._id || "",
      price: product.price || "",
      stock: product.stock || "",
      category: product.category?._id || "",
      images: [],
    });
    setOpenEdit(true);
  };

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-black min-h-screen text-white space-y-8 font-sans">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-6 gap-4">
        <div>
          <p className="text-[10px] tracking-[0.5em] text-[#A37E2C] font-bold uppercase">Archive Management</p>
          <h1 className="text-3xl font-serif italic mt-2 tracking-tight">Inventory Ledger</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#A37E2C]" size={14} />
            <input
              placeholder="Search assets..."
              className="bg-[#0A0A0A] border border-white/10 pl-10 pr-4 py-2 text-[12px] rounded-sm focus:border-[#A37E2C] outline-none w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Dialog open={openBrand} onOpenChange={setOpenBrand}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-white/10 bg-transparent hover:bg-white/5 text-[11px] uppercase tracking-widest h-10 px-6">
                <Tag size={14} className="mr-2 text-[#A37E2C]" /> Brand
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0A0A0A] border-white/10 text-white">
              <DialogHeader><DialogTitle className="font-serif italic text-xl">New Brand Registry</DialogTitle></DialogHeader>
              <form onSubmit={handleAddBrand} className="space-y-4 pt-4">
                <Input placeholder="Brand Name" className="bg-black border-white/10" value={brandForm.name} onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })} />
                <Input placeholder="Slug" className="bg-black border-white/10" value={brandForm.slug} readOnly />
                <Button type="submit" className="w-full bg-[#A37E2C] text-black font-bold uppercase">Register Brand</Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={openCategory} onOpenChange={setOpenCategory}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-white/10 bg-transparent hover:bg-white/5 text-[11px] uppercase tracking-widest h-10 px-6">
                <Layers size={14} className="mr-2 text-[#A37E2C]" /> Category
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0A0A0A] border-white/10 text-white">
              <DialogHeader><DialogTitle className="font-serif italic text-xl">New Classification</DialogTitle></DialogHeader>
              <form onSubmit={handleAddCategory} className="space-y-4 pt-4">
                <Input placeholder="Category Name" className="bg-black border-white/10" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })} />
                <Input placeholder="Slug" className="bg-black border-white/10" value={categoryForm.slug} readOnly />
                <Button type="submit" className="w-full bg-[#A37E2C] text-black uppercase font-bold">Register Category</Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={openProduct} onOpenChange={setOpenProduct}>
            <DialogTrigger asChild>
              <Button className="bg-[#A37E2C] hover:bg-[#8B6B25] text-black text-[11px] uppercase tracking-widest font-bold h-10 px-6">
                <Plus size={16} className="mr-2" /> New Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0A0A0A] border-white/10 text-white sm:max-w-[550px]">
              <DialogHeader><DialogTitle className="font-serif italic text-xl">Asset Registration</DialogTitle></DialogHeader>
              <form onSubmit={handleCreateProduct} className="grid grid-cols-2 gap-4 pt-4">
                <Input placeholder="Product Title" className="col-span-2 bg-black border-white/10" onChange={(e) => setProductForm({ ...productForm, title: e.target.value })} required />
                <Textarea
                  placeholder="Description"
                  value={productForm.description}
                  className="col-span-2 bg-black border-white/10"
                  onChange={(e) =>
                    setProductForm({ ...productForm, description: e.target.value })
                  }
                />

                <Select onValueChange={(val) => setProductForm({ ...productForm, brand: val })} required>
                  <SelectTrigger className="bg-black border-white/10"><SelectValue placeholder="Select Brand" /></SelectTrigger>
                  <SelectContent className="bg-[#0A0A0A] border-white/10 text-white">
                    {brands.map(b => <SelectItem key={b._id} value={b._id}>{b.name}</SelectItem>)}
                  </SelectContent>
                </Select>

                <Select onValueChange={(val) => setProductForm({ ...productForm, category: val })} required>
                  <SelectTrigger className="bg-black border-white/10"><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent className="bg-[#0A0A0A] border-white/10 text-white">
                    {categories.map(c => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>

                <Input type="number" placeholder="Price (₹)" className="bg-black border-white/10" onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} required />
                <Input type="number" placeholder="Stock Units" className="bg-black border-white/10" onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} required />

                <div className="col-span-2 border-2 border-dashed border-white/10 p-4 rounded-sm flex flex-col items-center justify-center gap-2 hover:border-[#A37E2C]/50 transition-colors">
                  <ImageIcon className="text-gray-500" size={24} />
                  <Input type="file" multiple className="bg-transparent border-none text-[10px] cursor-pointer" onChange={(e) => setProductForm({ ...productForm, images: Array.from(e.target.files) })} required />
                  <p className="text-[9px] text-gray-500 uppercase tracking-tighter">Support: JPG, PNG, WEBP (Max 10 images)</p>
                </div>

                <Button type="submit" className="col-span-2 bg-[#A37E2C] text-black font-bold uppercase py-6">Confirm Archive Entry</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Units" value={products.length} icon={<Package size={16} />} />
        <StatCard label="Active Brands" value={brands.length} icon={<Tag size={16} />} />
        <StatCard label="Low Stock" value={products.filter(p => p.stock < 10).length} icon={<AlertCircle size={16} />} isAlert />
      </div>

      {/* Main Table */}
      <div className="bg-[#080808] border border-white/5 rounded-sm overflow-hidden shadow-2xl">
        <table className="w-full text-left text-[12px]">
          <thead className="bg-white/[0.02] border-b border-white/5 text-[#A37E2C] uppercase text-[9px] tracking-[0.2em]">
            <tr>
              <th className="p-5">Asset Details</th>
              <th className="p-5">Classification</th>
              <th className="p-5">Valuation</th>
              <th className="p-5">Availability</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredProducts.map((p) => (
              <motion.tr key={p._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-white/[0.01] group">
                <td className="p-5 flex items-center gap-4">
                  <div className="relative h-12 w-12 flex-shrink-0">
                    <img src={p.images?.[0]?.url || "/placeholder.jpg"} className="h-full w-full rounded-sm border border-white/10 object-cover" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-200 line-clamp-1">{p.title}</p>
                    <p className="text-[10px] text-[#A37E2C] uppercase tracking-widest">
                      {p.brand?.name || "Private Label"}
                    </p>
                  </div>
                </td>
                <td className="p-5 text-gray-400">{p.category?.name || "Uncategorized"}</td>
                <td className="p-5 text-[#A37E2C] font-mono">₹{Number(p.price).toLocaleString()}</td>
                <td className="p-5">
                  <div className="flex items-center gap-2">
                    <span className={p.stock < 10 ? 'text-red-500 font-bold' : 'text-gray-400'}>{p.stock} Units</span>
                    {p.stock < 10 && <AlertCircle size={12} className="text-red-500 animate-pulse" />}
                  </div>
                </td>
                <td className="p-5 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openUpdateDialog(p)} className="p-2 text-gray-400 hover:text-[#A37E2C]"><Edit3 size={14} /></button>
                    <button onClick={() => handleDeleteProduct(p._id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Update Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="bg-[#0A0A0A] border-white/10 text-white sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="font-serif italic text-xl">Asset Registration</DialogTitle>
            <p className="text-xs text-muted-foreground">Add a new item to the permanent inventory ledger.</p>
          </DialogHeader>
          <form onSubmit={handleUpdateProduct} className="grid grid-cols-2 gap-4 pt-4">
            <Input placeholder="Title" value={productForm.title} className="col-span-2 bg-black border-white/10" onChange={(e) => setProductForm({ ...productForm, title: e.target.value })} />

            <Select value={productForm.brand} onValueChange={(val) => setProductForm({ ...productForm, brand: val })}>
              <SelectTrigger className="bg-black border-white/10"><SelectValue placeholder="Brand" /></SelectTrigger>
              <SelectContent className="bg-[#0A0A0A] border-white/10 text-white">
                {brands.map(b => <SelectItem key={b._id} value={b._id}>{b.name}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={productForm.category} onValueChange={(val) => setProductForm({ ...productForm, category: val })}>
              <SelectTrigger className="bg-black border-white/10"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent className="bg-[#0A0A0A] border-white/10 text-white">
                {categories.map(c => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>

            <Input type="number" placeholder="Price" value={productForm.price} className="bg-black border-white/10" onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />
            <Input type="number" placeholder="Stock" value={productForm.stock} className="bg-black border-white/10" onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} />

            <Input type="file" multiple className="col-span-2 bg-black border-white/10 text-[10px]" onChange={(e) => setProductForm({ ...productForm, images: Array.from(e.target.files) })} />

            <Button type="submit" className="col-span-2 bg-[#A37E2C] text-black font-bold uppercase py-6">Confirm Ledger Updates</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({ label, value, icon, isAlert }) {
  return (
    <div className="bg-[#0A0A0A] border border-white/5 p-5 rounded-sm flex items-center justify-between">
      <div>
        <p className="text-[9px] uppercase tracking-widest text-gray-500 mb-1">{label}</p>
        <p className={`text-2xl font-mono ${isAlert && value > 0 ? 'text-red-500' : 'text-white'}`}>{value}</p>
      </div>
      <div className="text-[#A37E2C] opacity-30">{icon}</div>
    </div>
  );
}