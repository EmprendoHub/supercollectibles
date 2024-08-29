"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import { cstDateTimeClient } from "@/backend/helpers";
import { updateRevalidateProduct } from "@/app/_actions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  set_colors,
  sizes_prendas,
  sizes_shoes_men,
  sizes_shoes_woman,
  product_categories,
  genders,
  blog_categories,
} from "@/backend/data/productData";
import MultiselectTagComponent from "@/components/layouts/MultiselectTagComponent";
import ToggleSwitch from "@/components/layouts/ToggleSwitch";
import { toast } from "sonner";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ValidationError {
  [key: string]: {
    _errors: string[];
  };
}

const EditVariationProduct = ({
  product,
  currentCookies,
}: {
  product: any;
  currentCookies: string;
}) => {
  const getPathname = usePathname();
  let pathname: string = "";
  if (getPathname.includes("admin")) {
    pathname = "admin";
  } else if (getPathname.includes("puntodeventa")) {
    pathname = "puntodeventa";
  } else if (getPathname.includes("instagram")) {
    pathname = "instagram";
  }
  const searchParams = useSearchParams();
  const searchValue = searchParams.get("callback");
  const [callBack, setCallBack] = useState<string>("");

  useEffect(() => {
    if (searchValue !== null) {
      setCallBack(searchValue);
    } else {
      setCallBack(""); // or any default value you prefer
    }
  }, [searchValue]);

  const router = useRouter();
  const [title, setTitle] = useState(product?.title);
  const [isSending, setIsSending] = useState(false);
  const [brand, setBrand] = useState(product?.brand);
  const [description, setDescription] = useState(product?.description);
  const [category, setCategory] = useState(product?.category);
  const [tags, setTags] = useState(product?.tags);
  const [gender, setGender] = useState(product?.gender);
  const [featured, setFeatured] = useState(product?.featured);
  const [branchAvailability, setBranchAvailability] = useState(
    product?.availability?.branch
  );
  const [instagramAvailability, setInstagramAvailability] = useState(
    product?.availability?.instagram
  );
  const [onlineAvailability, setOnlineAvailability] = useState(
    product?.availability?.online
  );
  const [updatedAt, setUpdatedAt] = useState(
    cstDateTimeClient().toLocaleString()
  );
  const [salePrice, setSalePrice] = useState(product?.sale_price);
  const [salePriceEndDate, setSalePriceEndDate] = useState(
    product?.sale_price_end_date || ""
  );
  const [sizeSelection, setSizeSelection] = useState(sizes_prendas);
  const [tagSelection, setTagSelection] = useState(blog_categories);
  const [validationError, setValidationError] =
    useState<ValidationError | null>(null);

  const [mainImage, setMainImage] = useState(product?.images[0].url);

  const [variations, setVariations] = useState(product?.variations);

  const isCombinationUnique = (size: any, color: any, index: any) => {
    return !variations.some(
      (variation: { size: any; color: any }, i: any) =>
        i !== index && variation.size === size && variation.color === color
    );
  };

  const addVariation = () => {
    setVariations(
      (
        prevVariations: {
          cost: any;
          price: any;
          image: any;
        }[]
      ) => [
        ...prevVariations,
        {
          size: "",
          color: "",
          colorHex: "",
          colorHexTwo: "",
          colorHexThree: "",
          price: prevVariations[0].price,
          cost: prevVariations[0].cost,
          stock: 1,
          image: prevVariations[0].image,
        },
      ]
    );
  };

  const removeVariation = (indexToRemove: any) => {
    setVariations((prevVariations: any[]) =>
      prevVariations.filter((_: any, index: any) => index !== indexToRemove)
    );
  };

  const handleSizeChange = (index: number, newSize: string) => {
    const color = variations[index].color;
    if (isCombinationUnique(newSize, color, index)) {
      const newVariations = [...variations];
      newVariations[index].size = newSize;
      setVariations(newVariations);
    } else {
      toast(
        "Esta combinación de tamaño y color ya existe. Por favor, elija otra talla o color."
      );
    }
  };

  const handleColorChange = (
    index: number,
    newColor: string,
    hex: string | null,
    hexTwo: string | null,
    hexThree: string | null
  ) => {
    const size = variations[index].size;
    if (isCombinationUnique(size, newColor, index)) {
      const newVariations = [...variations];
      newVariations[index].color = newColor;
      newVariations[index].colorHex = hex;
      newVariations[index].colorHexTwo = hexTwo;
      newVariations[index].colorHexThree = hexThree;
      setVariations(newVariations);
    } else {
      toast(
        "Esta combinación de tamaño y color ya existe. Por favor, elija otro color o talla."
      );
    }
  };

  const handlePriceChange = (index: number, newPrice: string) => {
    const newVariations = [...variations];
    newVariations[index].price = newPrice;
    setVariations(newVariations);
  };

  const handleCostChange = (index: number, newCost: string) => {
    const newVariations = [...variations];
    newVariations[index].cost = newCost;
    setVariations(newVariations);
  };

  const handleStockChange = (index: number, newStock: string) => {
    const newVariations = [...variations];
    newVariations[index].stock = newStock;
    setVariations(newVariations);
  };

  // handle image variations change
  const handleImageChange: any = async (index: number, newImage: File) => {
    // Retrieve a URL from our server.
    await retrieveNewURL(newImage, (file: any, url: string) => {
      const parsed = JSON.parse(url);
      url = parsed.url;
      // Compress and optimize the image before upload
      compressAndOptimizeImage(file, url, index);
    });
  };

  async function compressAndOptimizeImage(
    file: Blob | MediaSource,
    url: string,
    index: number
  ) {
    // Create an HTML Image element
    const img = document.createElement("img");

    // Load the file into the Image element
    img.src = URL.createObjectURL(file);

    // Wait for the image to load
    img.onload = async () => {
      // Create a canvas element
      const canvas = document.createElement("canvas");
      const ctx: any = canvas.getContext("2d");

      // Set the canvas dimensions to the image dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image onto the canvas
      ctx.drawImage(img, 0, 0);

      // Compress and set quality (adjust quality value as needed)
      const quality = 0.8; // Adjust quality value as needed
      const compressedImageData = canvas.toDataURL("image/jpeg", quality);

      // Convert base64 data URL to Blob
      const blobData = await fetch(compressedImageData).then((res) =>
        res.blob()
      );

      // Upload the compressed image
      uploadVariationFile(blobData, url, index);
    };
  }

  async function uploadVariationFile(
    blobData: Blob,
    url: any | URL | Request,
    index: number
  ) {
    fetch(url, {
      method: "PUT",
      body: blobData,
    })
      .then(() => {
        const newUrl = url?.split("?");
        const newVariations = [...variations];
        newVariations[index].image = newUrl[0];
        setVariations(newVariations);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  // generate a pre-signed URL for use in uploading that file:
  async function retrieveNewURL(
    file: File,
    cb: {
      (file: any, url: string): void;
      (file: any, url: any): void;
      (arg0: any, arg1: string): void;
    }
  ) {
    const endpoint = `/api/minio/`;
    fetch(endpoint, {
      method: "PUT",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Name: file.name,
      },
    })
      .then((response) => {
        response.text().then((url) => {
          cb(file, url);
        });
      })
      .catch((e) => {
        console.error(e);
      });
  }

  // ***************** main images //
  // functions
  const upload = async (e: any) => {
    // Get selected files from the input element.
    let files = e?.target.files;
    let section = e?.target.id;
    if (files) {
      for (var i = 0; i < files?.length; i++) {
        var file = files[i];
        // Retrieve a URL from our server.
        retrieveNewURL(file, (file, url) => {
          const parsed = JSON.parse(url);
          url = parsed.url;
          // Compress and optimize the image before upload
          compressAndOptimizeMainImage(file, url, section);
        });
      }
    }
  };

  async function compressAndOptimizeMainImage(
    file: Blob | MediaSource,
    url: any,
    section: any
  ) {
    // Create an HTML Image element
    const img = document.createElement("img");

    // Load the file into the Image element
    img.src = URL.createObjectURL(file);

    // Wait for the image to load
    img.onload = async () => {
      // Create a canvas element
      const canvas = document.createElement("canvas");
      const ctx: any = canvas.getContext("2d");

      // Set the canvas dimensions to the image dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image onto the canvas
      ctx.drawImage(img, 0, 0);

      // Compress and set quality (adjust quality value as needed)
      const quality = 0.8; // Adjust quality value as needed
      const compressedImageData = canvas.toDataURL("image/jpeg", quality);

      // Convert base64 data URL to Blob
      const blobData = await fetch(compressedImageData).then((res) =>
        res.blob()
      );

      // Upload the compressed image
      uploadFile(blobData, url, section);
    };
  }

  // to upload this file to S3 at `https://minio.salvawebpro.com:9000` using the URL:
  async function uploadFile(
    blobData: Blob,
    url: any | URL | Request,
    section: string
  ) {
    fetch(url, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      method: "PUT",
      body: blobData,
    })
      .then(() => {
        // If multiple files are uploaded, append upload status on the next line.
        // document.querySelector(
        //   '#status'
        // ).innerHTML += `<br>Uploaded ${file.name}.`;
        const newUrl = url.split("?");
        if (section === "selectorMain") {
          setMainImage(newUrl[0]);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }

  async function hanldeFormSubmit(e: any) {
    e.preventDefault();
    if (
      !mainImage ||
      mainImage === "/images/product-placeholder-minimalist.jpg"
    ) {
      const noMainImageError = {
        mainImage: { _errors: ["Se requiere una imagen "] },
      };
      setValidationError(noMainImageError);
      return;
    }
    if (!title) {
      const noTitleError = { title: { _errors: ["Se requiere un titulo "] } };
      setValidationError(noTitleError);
      return;
    }
    if (!description) {
      const noDescriptionError = {
        description: { _errors: ["Se requiere descripción "] },
      };
      setValidationError(noDescriptionError);
      return;
    }
    if (!brand) {
      const noBrandError = {
        brand: { _errors: ["Se requiere un Marca "] },
      };
      setValidationError(noBrandError);
      return;
    }
    if (!tags) {
      const noTagsError = {
        tags: { _errors: ["Se requiere mínimo una etiqueta "] },
      };
      setValidationError(noTagsError);
      return;
    }
    if (!variations[0]?.cost) {
      const noCostError = {
        cost: { _errors: ["Se requiere un costo de producto "] },
      };
      setValidationError(noCostError);
      return;
    }
    if (!variations[0]?.price) {
      const noPriceError = {
        price: { _errors: ["Se requiere un precio de producto "] },
      };
      setValidationError(noPriceError);
      return;
    }
    if (!variations[0]?.size) {
      const noSizesError = {
        sizes: { _errors: ["Se requiere una talla o tamaño "] },
      };
      setValidationError(noSizesError);
      return;
    }
    if (!variations[0]?.color) {
      const noColorsError = {
        colors: { _errors: ["Se requiere un color "] },
      };
      setValidationError(noColorsError);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("featured", featured);
    formData.append("branchAvailability", branchAvailability);
    formData.append("instagramAvailability", instagramAvailability);
    formData.append("onlineAvailability", onlineAvailability);
    formData.append("brand", brand);
    formData.append("gender", gender);
    formData.append("mainImage", mainImage);
    formData.append("variations", JSON.stringify(variations));
    formData.append("tags", JSON.stringify(tags));
    formData.append(
      "salePrice",
      salePrice !== undefined ? salePrice.toString() : ""
    );
    formData.append("salePriceEndDate", salePriceEndDate);
    formData.append("updatedAt", updatedAt);
    formData.append("_id", product?._id);
    // write to database using server actions

    setIsSending(true);
    const endpoint = `/api/newproduct`;
    const result: any = await fetch(endpoint, {
      method: "PUT",
      headers: {
        Cookie: currentCookies,
      },
      body: formData,
    });

    if (result?.error) {
      setValidationError(result.error);
      setIsSending(false);
    } else {
      setValidationError(null);
      //reset the form

      //formRef.current.reset();
      await updateRevalidateProduct();
      router.push(`/${pathname}/productos?&page=${callBack}`);
    }
  }

  const handleCategoryChange = async (e: any) => {
    setCategory(e);
    if (e === "Calzado" && gender == "Damas") {
      setSizeSelection(sizes_shoes_woman);
    } else {
      setSizeSelection(sizes_shoes_men);
    }

    if (
      e === "Prendas" ||
      e === "Bolsas" ||
      e === "Accesorios" ||
      e === "Belleza" ||
      e === "Joyeria"
    ) {
      setSizeSelection(sizes_prendas);
    }
  };

  const handleAddTagField = (option: any) => {
    setTags(option);
  };

  function onChangeDate(date: any) {
    setSalePriceEndDate(date);
  }

  const handleGenderChange = async (e: any) => {
    setGender(e);
    if (category === "Calzado" && e == "Damas") {
      setSizeSelection(sizes_shoes_woman);
    } else {
      setSizeSelection(sizes_shoes_men);
    }

    if (
      category === "Prendas" ||
      category === "Bolsas" ||
      category === "Accesorios" ||
      category === "Belleza" ||
      category === "Joyeria"
    ) {
      setSizeSelection(sizes_prendas);
    }
  };

  useEffect(() => {
    // handle Gender Change
    setGender(product?.gender);
    if (category === "Calzado" && product?.gender == "Damas") {
      setSizeSelection(sizes_shoes_woman);
    } else {
      setSizeSelection(sizes_shoes_men);
    }

    if (
      category === "Prendas" ||
      category === "Bolsas" ||
      category === "Accesorios" ||
      category === "Belleza" ||
      category === "Joyeria"
    ) {
      setSizeSelection(sizes_prendas);
    }

    if (product?.category === "Calzado" && gender == "Damas") {
      setSizeSelection(sizes_shoes_woman);
    } else {
      setSizeSelection(sizes_shoes_men);
    }

    if (
      product?.category === "Prendas" ||
      product?.category === "Bolsas" ||
      product?.category === "Accesorios" ||
      product?.category === "Belleza" ||
      product?.category === "Joyeria"
    ) {
      setSizeSelection(sizes_prendas);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <main className="w-full p-4 maxsm:p-2 bg-background">
      {!isSending ? (
        <div className="flex flex-col items-start gap-5 justify-start w-full">
          <section className="w-full ">
            <div className="flex flex-row maxmd:flex-col items-center justify-between">
              <h1 className="w-full text-2xl font-semibold text-foreground mb-8 font-EB_Garamond">
                Actualizar Producto Con Variaciones
              </h1>
              {/* Availability */}
              <div className="mb-4 w-full flex flex-row gap-4 items-center uppercase">
                <ToggleSwitch
                  label="Destacado"
                  enabled={featured}
                  setEnabled={setFeatured}
                />
                <ToggleSwitch
                  label="MercadoLibre"
                  enabled={instagramAvailability}
                  setEnabled={setInstagramAvailability}
                />
                <ToggleSwitch
                  label="Sucursal"
                  enabled={branchAvailability}
                  setEnabled={setBranchAvailability}
                />
                <ToggleSwitch
                  label="WWW"
                  enabled={onlineAvailability}
                  setEnabled={setOnlineAvailability}
                />
              </div>
            </div>

            <div className="flex flex-row maxmd:flex-col items-start gap-3 justify-between w-full">
              <div className="gap-y-1 flex-col flex px-2 w-full">
                {/*  Imagen principal del Producto */}
                <div className="relative hover:opacity-80 bg-background border-4 border-gray-300">
                  <label htmlFor="selectorMain" className="cursor-pointer">
                    <Image
                      id="blogImage"
                      alt="blogBanner"
                      src={mainImage}
                      width={1280}
                      height={1280}
                      className="w-full h-full object-cover z-20"
                    />
                    <input
                      id="selectorMain"
                      type="file"
                      accept=".png, .jpg, .jpeg, .webp"
                      hidden
                      onChange={upload}
                    />

                    {validationError?.mainImage && (
                      <p className="text-sm text-red-400">
                        {validationError.mainImage._errors.join(", ")}
                      </p>
                    )}
                  </label>
                </div>
              </div>

              <div className="w-full flex-col flex justify-start px-2 gap-y-2">
                <div className="mb-1">
                  <label className="block mb-1  font-EB_Garamond">
                    Titulo del Producto
                  </label>
                  <input
                    type="text"
                    className="appearance-none border bg-background rounded-md py-2 px-3 border-gray-300 focus:outline-none focus:border-gray-400 w-full"
                    placeholder="Nombre de Producto"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    name="title"
                  />
                  {validationError?.title && (
                    <p className="text-sm text-red-400">
                      {validationError.title._errors.join(", ")}
                    </p>
                  )}
                </div>
                <div className="mb-1">
                  <label className="block mb-1  font-EB_Garamond">
                    {" "}
                    Description Corta
                  </label>
                  <textarea
                    rows={2}
                    className="appearance-none border  bg-background rounded-md py-2 px-3 border-gray-300 focus:outline-none focus:border-gray-400 w-full"
                    placeholder="Descripción del Producto"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    name="description"
                  ></textarea>
                  {validationError?.description && (
                    <p className="text-sm text-red-400">
                      {validationError.description._errors.join(", ")}
                    </p>
                  )}
                </div>

                {/* Marca y genero */}
                <div className=" flex flex-row items-center gap-3">
                  <div className="mb-4 w-full">
                    <input
                      type="text"
                      className="appearance-none border bg-input rounded-md py-2 px-3 border-gray-300 focus:outline-none focus:border-gray-400 w-full"
                      placeholder="Marca"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      name="brand"
                    />
                    {validationError?.brand && (
                      <p className="text-sm text-red-400">
                        {validationError.brand._errors.join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="mb-4 w-full">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Género" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup
                          onChange={(e: any) =>
                            handleGenderChange(e.target.value)
                          }
                        >
                          {genders?.map((gender) => (
                            <SelectItem key={gender.es} value={gender.es}>
                              {gender.es}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {validationError?.gender && (
                      <p className="text-sm text-red-400">
                        {validationError.gender._errors.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
                {/* Etiquetas y Categoria */}
                <div className=" flex flex-row items-center gap-3">
                  <div className="mb-1 w-full">
                    <div className="relative ">
                      <MultiselectTagComponent
                        values={tags}
                        options={tagSelection}
                        handleAddTagField={handleAddTagField}
                      />
                      {validationError?.tags && (
                        <p className="text-sm text-red-400">
                          {validationError.tags._errors.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mb-4 w-full">
                    <div className="relative">
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup
                            onChange={(e: any) =>
                              handleCategoryChange(e.target.value)
                            }
                          >
                            {product_categories.map((category) => (
                              <SelectItem key={category.es} value={category.es}>
                                {category.es}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {validationError?.category && (
                        <p className="text-sm text-red-400">
                          {validationError.category._errors.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-4 w-full flex gap-5 flex-row items-center justify-center">
                  <div className="flex w-full flex-col">
                    <label className="block mb-1 font-EB_Garamond">
                      Precio de Oferta
                    </label>
                    <div className="relative">
                      <div className="col-span-2">
                        <input
                          type="number"
                          className="appearance-none border border-gray-300 bg-background rounded-md py-2 px-3focus:outline-none focus:border-gray-400 w-full remove-arrow "
                          placeholder="0.00"
                          min="0"
                          value={salePrice}
                          onChange={(e) => setSalePrice(e.target.value)}
                          name="salePrice"
                        />
                        {validationError?.salePrice && (
                          <p className="text-sm text-red-400">
                            {validationError.salePrice._errors.join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mb-4 w-full h-full">
                    <label className="block mb-1 font-EB_Garamond">
                      Fecha de Fin de Oferta
                    </label>
                    <div className="flex flex-row items-center gap-x-3"></div>
                    <DateTimePicker
                      onChange={onChangeDate}
                      value={salePriceEndDate}
                      locale={"es-MX"}
                      minDate={cstDateTimeClient()}
                      className={"h-full"}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[300px]">
              <div
                onClick={addVariation}
                className="my-4 px-8 py-2 text-center inline-block text-white bg-black border border-transparent rounded-md hover:bg-slate-800 w-auto cursor-pointer"
              >
                Variación +
              </div>
            </div>
            {/* Main Variation */}
            <div className="w-full main-variation flex maxsm:flex-col items-center">
              <div className="flex flex-row items-center gap-3 w-2/3  maxsm:w-full">
                <div className="mb-4 w-full">
                  <label className="block mb-1 font-EB_Garamond"> Talla </label>
                  <div className="relative">
                    <select
                      value={variations[0]?.size}
                      name="size"
                      onChange={(e) => handleSizeChange(0, e.target.value)}
                      className="appearance-none border border-gray-300 bg-background rounded-md pl-2 cursor-pointer focus:outline-none focus:border-gray-400 w-full"
                    >
                      {sizeSelection.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.value}
                        </option>
                      ))}
                    </select>
                    {validationError?.sizes && (
                      <p className="text-sm text-red-400">
                        {validationError.sizes._errors.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mb-4 w-full">
                  <label className="block mb-1 font-EB_Garamond"> Color </label>
                  <div className="relative">
                    <select
                      value={variations[0]?.color}
                      name={variations[0]?.colorHex}
                      onChange={(e) => {
                        const selectedOption =
                          e.target.options[e.target.selectedIndex];
                        const hexValue =
                          selectedOption.getAttribute("data-hex");
                        const hexTwoValue =
                          selectedOption.getAttribute("data-hextwo");
                        const hexThreeValue =
                          selectedOption.getAttribute("data-hexthree");
                        handleColorChange(
                          0,
                          e.target.value,
                          hexValue,
                          hexTwoValue,
                          hexThreeValue
                        );
                      }}
                      className="appearance-none border border-gray-300 bg-background rounded-md pl-2 cursor-pointer focus:outline-none focus:border-gray-400 w-full"
                    >
                      {set_colors.map((option) => (
                        <option
                          data-hex={option.hex}
                          data-hextwo={option.hexTwo}
                          data-hexthree={option.hexThree}
                          key={option.value}
                          value={option.value}
                        >
                          {option.value}
                        </option>
                      ))}
                    </select>
                    {validationError?.colors && (
                      <p className="text-sm text-red-400">
                        {validationError.colors._errors.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mb-4 w-full">
                  <label className="block mb-1  font-EB_Garamond">Precio</label>
                  <div className="relative">
                    <div className="col-span-2">
                      <input
                        type="number"
                        className="appearance-none border border-gray-300 bg-background rounded-md pl-2 remove-arrow  focus:outline-none focus:border-gray-400 w-full"
                        placeholder="0.00"
                        min="1"
                        value={variations[0]?.price}
                        onChange={(e) => handlePriceChange(0, e.target.value)}
                        name="price"
                      />
                      {validationError?.price && (
                        <p className="text-sm text-red-400">
                          {validationError.price._errors.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mb-4 w-full">
                  <label className="block mb-1 font-EB_Garamond"> Costo </label>
                  <div className="relative">
                    <div className="col-span-2">
                      <input
                        type="number"
                        className="appearance-none border border-gray-300 bg-background rounded-md pl-2 remove-arrow focus:outline-none focus:border-gray-400 w-full"
                        placeholder="0.00"
                        min="1"
                        value={variations[0]?.cost}
                        onChange={(e) => handleCostChange(0, e.target.value)}
                        name="cost"
                      />
                      {validationError?.cost && (
                        <p className="text-sm text-red-400">
                          {validationError.cost._errors.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mb-4 w-full">
                  <label className="block mb-1 font-EB_Garamond">
                    {" "}
                    Existencias{" "}
                  </label>
                  <div className="relative">
                    <div className="col-span-2">
                      <input
                        type="number"
                        className="appearance-none border border-gray-300 bg-background rounded-md pl-2 remove-arrow focus:outline-none focus:border-gray-400 w-full"
                        placeholder="1"
                        min="1"
                        value={variations[0]?.stock}
                        onChange={(e) => handleStockChange(0, e.target.value)}
                        name="stock"
                      />
                      {validationError?.stock && (
                        <p className="text-sm text-red-400">
                          {validationError.stock._errors.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* Imagen de Variación # 1 */}
              <div className="mb-4 w-1/3 maxsm:w-full">
                <div className="relative flex min-w-full  hover:opacity-80 bg-background border-4 border-gray-300">
                  <label htmlFor="selectorVarOne" className="cursor-pointer">
                    <Image
                      id="MainVariation"
                      alt="Main Variation"
                      src={variations[0]?.image}
                      width={500}
                      height={500}
                      className="w-full h-full object-cover z-20"
                    />
                    <input
                      id="selectorVarOne"
                      type="file"
                      accept=".png, .jpg, .jpeg, .webp"
                      hidden
                      onChange={(e: any) =>
                        handleImageChange(0, e.target.files[0])
                      }
                    />

                    {validationError?.mainImage && (
                      <p className="text-sm text-red-400">
                        {validationError.mainImage._errors.join(", ")}
                      </p>
                    )}
                  </label>
                </div>
              </div>
            </div>

            {/* Render additional variations */}
            {variations.slice(1).map(
              (
                variation: {
                  size: string | number | readonly string[] | undefined;
                  color: string | number | readonly string[] | undefined;
                  price: string | number | readonly string[] | undefined;
                  cost: string | number | readonly string[] | undefined;
                  stock: string | number | readonly string[] | undefined;
                  image: string | StaticImport;
                },
                index: number
              ) => (
                <div
                  key={index + 1}
                  className={`w-full variation-${
                    index + 1
                  } flex maxsm:flex-col items-center`}
                >
                  <div className="relative flex flex-row items-center gap-3 maxsm:gap-1 w-2/3  maxsm:w-full">
                    <div
                      onClick={() => removeVariation(index + 1)}
                      className="absolute top-0 -left-5 px-1 bg-red-500 text-white rounded-full cursor-pointer z-50 text-xs"
                    >
                      X
                    </div>
                    <div className="mb-4 w-full">
                      <label className="block mb-1 font-EB_Garamond">
                        {" "}
                        Talla{" "}
                      </label>
                      <div className="relative">
                        <select
                          value={variation.size}
                          name={`size-${index + 1}`}
                          onChange={(e) =>
                            handleSizeChange(index + 1, e.target.value)
                          }
                          className="appearance-none border border-gray-300 bg-background rounded-md pl-2 cursor-pointer focus:outline-none focus:border-gray-400 w-full"
                        >
                          {sizeSelection.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.value}
                            </option>
                          ))}
                        </select>

                        {validationError?.sizes && (
                          <p className="text-sm text-red-400">
                            {validationError.sizes._errors.join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mb-4 w-full">
                      <label className="block mb-1 font-EB_Garamond">
                        {" "}
                        Color{" "}
                      </label>
                      <div className="relative">
                        <select
                          value={variation.color}
                          name={`color-${index + 1}`}
                          onChange={(e) => {
                            const selectedOption =
                              e.target.options[e.target.selectedIndex];
                            const hexValue =
                              selectedOption.getAttribute("data-hex");
                            const hexTwoValue =
                              selectedOption.getAttribute("data-hextwo");
                            const hexThreeValue =
                              selectedOption.getAttribute("data-hexthree");
                            handleColorChange(
                              index + 1,
                              e.target.value,
                              hexValue,
                              hexTwoValue,
                              hexThreeValue
                            );
                          }}
                          className="appearance-none border border-gray-300 bg-background rounded-md pl-2 cursor-pointer  focus:outline-none focus:border-gray-400 w-full"
                        >
                          {set_colors.map((option) => (
                            <option
                              data-hex={option.hex}
                              data-hextwo={option.hexTwo}
                              data-hexthree={option.hexThree}
                              key={option.value}
                              value={option.value}
                            >
                              {option.value}
                            </option>
                          ))}
                        </select>
                        {validationError?.colors && (
                          <p className="text-sm text-red-400">
                            {validationError.colors._errors.join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mb-4 w-full">
                      <label className="block mb-1 font-EB_Garamond">
                        Precio
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          value={variation.price}
                          name={`price-${index + 1}`}
                          onChange={(e) =>
                            handlePriceChange(index + 1, e.target.value)
                          }
                          className="appearance-none border border-gray-300 bg-background rounded-md pl-2 curs focus:outline-none focus:border-gray-400 w-full m-0 remove-arrow"
                        />
                      </div>
                    </div>
                    <div className="mb-4 w-full">
                      <label className="block mb-1 font-EB_Garamond">
                        {" "}
                        Costo{" "}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          value={variation.cost}
                          name={`cost-${index + 1}`}
                          onChange={(e) =>
                            handleCostChange(index + 1, e.target.value)
                          }
                          className="appearance-none border border-gray-300 bg-background rounded-md pl-2 remove-arrow focus:outline-none focus:border-gray-400 w-full"
                        />
                      </div>
                    </div>
                    <div className="mb-4 w-full">
                      <label className="block mb-1 font-EB_Garamond">
                        {" "}
                        Existencias{" "}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          value={variation.stock}
                          name={`stock-${index + 1}`}
                          onChange={(e) =>
                            handleStockChange(index + 1, e.target.value)
                          }
                          className="appearance-none border border-gray-300 bg-background rounded-md pl-2 remove-arrow focus:outline-none focus:border-gray-400 w-full"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Dynamic Image Variation */}
                  <div className="mb-4 w-1/3 maxsm:w-full">
                    <div className="relative aspect-video hover:opacity-80 bg-background border-4 border-gray-300">
                      <label
                        htmlFor={`selector${index + 1}`}
                        className="cursor-pointer"
                      >
                        <Image
                          id={`variation-${index + 1}`}
                          alt={`image variation-${index + 1}`}
                          src={variation.image}
                          width={500}
                          height={500}
                          className="w-full h-full object-cover z-20"
                        />
                        <input
                          id={`selector${index + 1}`}
                          type="file"
                          accept=".png, .jpg, .jpeg, .webp"
                          hidden
                          onChange={(e: any) =>
                            handleImageChange(index + 1, e.target.files[0])
                          }
                        />

                        {validationError?.mainImage && (
                          <p className="text-sm text-red-400">
                            {validationError.mainImage._errors.join(", ")}
                          </p>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              )
            )}

            <button
              disabled={isSending}
              onClick={hanldeFormSubmit}
              className={`${
                isSending ? "cursor-wait" : ""
              } my-2 cursor-pointer px-4 py-2 text-center inline-block text-white bg-black border border-transparent rounded-md hover:bg-slate-800 w-full`}
            >
              {isSending ? "Actualizando..." : "Actualizar"}
            </button>
          </section>
        </div>
      ) : (
        <section className="w-full min-h-screen">
          <div className="flex flex-col items-center justify-center min-h-screen w-full">
            <span className="loader"></span>
            <h2 className="text-sm">Actualizando producto...</h2>
          </div>
        </section>
      )}
    </main>
  );
};

export default EditVariationProduct;
