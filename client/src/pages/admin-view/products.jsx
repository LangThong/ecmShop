/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */
import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
  getFilterProducts,
} from "@/store/admin/products-slice";
import { Plus, Search } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
};

const defaultValues = {
  title: "",
  category: "all",
  maxAmount: 10000000,
  minAmount: 0,
  brand: "all",
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
  });

  function onSubmit(event) {
    event.preventDefault();

    currentEditedId !== null
      ? dispatch(
          editProduct({
            id: currentEditedId,
            formData,
          })
        ).then((data) => {
          console.log(data, "edit");

          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setFormData(initialFormData);
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null);
          }
        })
      : dispatch(
          addNewProduct({
            ...formData,
            image: uploadedImageUrl,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setOpenCreateProductsDialog(false);
            setImageFile(null);
            setFormData(initialFormData);
            toast({
              title: "Product add successfully",
            });
          }
        });
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
      }
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .filter((currentKey) => currentKey !== "averageReview")
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  useEffect(() => {
    dispatch(getFilterProducts(defaultValues));
  }, [dispatch]);

  //   console.log(formData, "productList");
  const onSubmitFiler = (data) => {
    console.log(data);
    dispatch(getFilterProducts(data));
    // console.log(orderList);
  };

  return (
    <Fragment>
      <div className="mb-5 w-full flex gap-3">
        <form onSubmit={handleSubmit(onSubmitFiler)} className="mb-8 flex-1">
          <div className="grid grid-cols-3 gap-3 outline-emerald-200 relative">
            {/* Customer Name */}
            <div>
              <label className="text-blue-900 block text-sm font-medium">
                Tên sản phẩm
              </label>
              <input
                type="text"
                {...register("title")}
                placeholder="Nhập tên sản phẩm"
                className="mt-1 block w-full border border-gray-200 rounded-md p-1"
              />
            </div>

            {/* Status */}
            <div>
              <label className="text-blue-900 block text-sm font-medium">
                Loại sản phẩm
              </label>
              <select
                {...register("category")}
                className="mt-1 block w-full border border-gray-200 rounded-md p-1"
              >
                <option value="all">Tất cả</option>
                <option value="men">Đàn ông</option>
                <option value="women">Phụ nữ</option>
                <option value="kids">Trẻ em</option>
                <option value="accessories">Phụ kiện</option>
                <option value="footwear">Giày dép</option>
              </select>
            </div>
            <div>
              <label className="text-blue-900 block text-sm font-medium">
                Thương hiệu
              </label>
              <select
                {...register("brand")}
                className="mt-1 block w-full border border-gray-200 rounded-md p-1"
              >
                <option value="all">Tất cả</option>
                <option value="nike">Nike</option>
                <option value="adidas">Adidas</option>
                <option value="puma">Puma</option>
                <option value="levi">Levi</option>
                <option value="zara">Zara</option>
                <option value="h&m">H&m</option>
              </select>
            </div>

            {/* Min Amount */}
            <div>
              <label className="text-blue-900 block text-sm font-medium">
                Từ giá
              </label>
              <input
                type="number"
                {...register("minAmount")}
                placeholder="Từ số tiền"
                className="mt-1 block w-full border border-gray-200 rounded-md p-1"
              />
            </div>
            {/* Max Amount */}
            <div>
              <label className="text-blue-900 block text-sm font-medium">
                Đến giá
              </label>
              <input
                type="number"
                {...register("maxAmount")}
                placeholder="Đến số tiền"
                className="mt-1 block w-full border border-gray-200 rounded-md p-1"
              />
            </div>

            {/* Payment Method */}

            {/* Action buttons */}
            <div className=" flex gap-4 absolute bottom-0 right-0">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-sm flex text-center items-center gap-2"
              >
                <Search size={20} />
                <span>Tìm kiếm</span>
              </button>
            </div>
          </div>
        </form>
        <Button
          className="justify-end"
          onClick={() => setOpenCreateProductsDialog(true)}
        >
          <Plus className="mr-2" />
          <span>Thêm sản phẩm</span>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <AdminProductTile
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                handleDelete={handleDelete}
              />
            ))
          : null}
      </div>
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null
                ? "Chỉnh sửa sản phẩm"
                : "Thêm sản phẩm"}
            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
