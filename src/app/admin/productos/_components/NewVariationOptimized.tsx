"use client";
import React, { useState } from "react";
import Image from "next/image";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import { cstDateTimeClient } from "@/backend/helpers";
import { updateRevalidateProduct } from "@/app/_actions";
import { usePathname, useRouter } from "next/navigation";
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
import { toast } from "@/components/ui/use-toast";
import { ValidationError } from "@/types";

const NewVariationOptimized = ({
  currentCookies,
}: {
  currentCookies: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [title, setTitle] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [brand, setBrand] = useState("");
  const [branchAvailability, setBranchAvailability] = useState(true);
  const [instagramAvailability, setInstagramAvailability] = useState(false);
  const [onlineAvailability, setOnlineAvailability] = useState(false);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Moda");
  const [tags, setTags] = useState([]);
  const [gender, setGender] = useState("Damas");
  const [featured, setFeatured] = useState(false);
  const [createdAt, setCreatedAt] = useState(
    cstDateTimeClient().toLocaleString()
  );
  const [salePrice, setSalePrice] = useState(0);
  const [salePriceEndDate, setSalePriceEndDate] = useState("");
  const [sizeSelection, setSizeSelection] = useState(sizes_prendas);
  const [tagSelection, setTagSelection] = useState(blog_categories);
  const [validationError, setValidationError] =
    useState<ValidationError | null>(null);

  const [mainImage, setMainImage] = useState(
    "/images/product-placeholder-minimalist.jpg"
  );

  const [mainVariation, setMainVariation] = useState(
    "/images/product-placeholder-minimalist.jpg"
  );

  const [variations, setVariations] = useState([
    {
      size: "",
      color: "",
      colorHex: "",
      colorHexTwo: "",
      colorHexThree: "",
      price: 0,
      cost: 0,
      stock: 1,
      image: "/images/product-placeholder-minimalist.jpg",
    },
  ]);

  const addVariation = () => {
    setVariations((prevVariations) => [
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
    ]);
  };

  const removeVariation = (indexToRemove: number) => {
    setVariations((prevVariations) =>
      prevVariations.filter((_, index) => index !== indexToRemove)
    );
  };

  const isCombinationUnique = (size: string, color: string, index: number) => {
    return !variations.some(
      (variation, i) =>
        i !== index && variation.size === size && variation.color === color
    );
  };

  const handleSizeChange = (index: number, newSize: string) => {
    const color = variations[index].color;
    if (newSize && isCombinationUnique(newSize, color, index)) {
      const newVariations = [...variations];
      newVariations[index].size = newSize;
      setVariations(newVariations);
    } else {
      const newVariations = [...variations];
      newVariations[index].size = "";
      setVariations(newVariations);
      toast({
        variant: "destructive",
        title: "Esta combinación de tamaño y color ya existe. ",
        description: "Por favor, elija otra talla o color.",
      });
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
    if (newColor && isCombinationUnique(size, newColor, index)) {
      const newVariations: any = [...variations];
      newVariations[index].color = newColor;
      newVariations[index].colorHex = hex;
      newVariations[index].colorHexTwo = hexTwo;
      newVariations[index].colorHexThree = hexThree;
      setVariations(newVariations);
    } else {
      // Reset the color if the combination is not unique
      const newVariations = [...variations];
      newVariations[index].color = ""; // Reset to empty
      setVariations(newVariations);
      toast({
        variant: "destructive",
        title: "Esta combinación de tamaño y color ya existe. ",
        description: "Por favor, elija otro color o talla.",
      });
    }
  };

  const handlePriceChange = (index: number, newPrice: string | number) => {
    const newVariations: any = [...variations];
    newVariations[index].price = newPrice;
    setVariations(newVariations);
  };

  const handleCostChange = (index: number, newCost: string | number) => {
    const newVariations: any = [...variations];
    newVariations[index].cost = newCost;
    setVariations(newVariations);
  };

  const handleStockChange = (index: number, newStock: string | number) => {
    const newVariations: any = [...variations];
    newVariations[index].stock = newStock;
    setVariations(newVariations);
  };

  // handle image variations change
  const handleVariationImageChange = async (e: any, index: number) => {
    // Get selected files from the input element.
    let files = e?.target.files;
    if (files) {
      for (var i = 0; i < files?.length; i++) {
        var file = files[i];
        // Retrieve a URL from our server.
        retrieveNewURL(file, (file: any, url: string) => {
          const parsed = JSON.parse(url);
          url = parsed.url;
          // Compress and optimize the image before upload
          compressAndOptimizeImage(file, url, index);
        });
      }
    }
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
        const newUrl = url.split("?");
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
    file: { name: any },
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

  // *******main images**********  //
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
          setVariations([
            {
              size: variations[0].size,
              color: variations[0].color,
              colorHex: variations[0].colorHex,
              colorHexTwo: variations[0].colorHexTwo,
              colorHexThree: variations[0].colorHexThree,
              price: variations[0].price,
              cost: variations[0].cost,
              stock: variations[0].stock,
              image: `${newUrl[0]}`,
            },
          ]);
        }
        if (section === "selectorVarOne") {
          setMainVariation(newUrl[0]);
        }
      })
      .catch((e) => {
        console.error(e);
      });
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

  const handleAddTagField = (option: React.SetStateAction<never[]>) => {
    setTags(option);
  };

  const onChangeDate: any = (date: React.SetStateAction<string>) => {
    setSalePriceEndDate(date);
  };

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
    if (!variations[0].cost) {
      const noCostError = {
        cost: { _errors: ["Se requiere un costo de producto "] },
      };
      setValidationError(noCostError);
      return;
    }
    if (!variations[0].price) {
      const noPriceError = {
        price: { _errors: ["Se requiere un precio de producto "] },
      };
      setValidationError(noPriceError);
      return;
    }
    if (!variations[0].size) {
      const noSizesError = {
        sizes: { _errors: ["Se requiere una talla o tamaño "] },
      };
      setValidationError(noSizesError);
      return;
    }
    if (!variations[0].color) {
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
    formData.append(
      "featured",
      featured !== undefined ? featured.toString() : ""
    );
    formData.append(
      "branchAvailability",
      branchAvailability !== undefined ? branchAvailability.toString() : ""
    );
    formData.append(
      "instagramAvailability",
      instagramAvailability !== undefined
        ? instagramAvailability.toString()
        : ""
    );
    formData.append(
      "onlineAvailability",
      onlineAvailability !== undefined ? onlineAvailability.toString() : ""
    );
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
    formData.append("createdAt", createdAt);
    // write to database using server actions

    //const result = await addVariationProduct(formData);
    // const result = await updateVariationProduct(formData);
    const endpoint = `/api/newproduct`;
    setIsSending(true);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Cookie: currentCookies,
      },
      body: formData,
    });

    if (!response?.ok) {
      if (response.status === 409) {
        setValidationError({
          response: {
            _errors: ["Este Titulo de producto ya esta en uso"],
          },
        });
      }

      setIsSending(false);
    } else if (response?.ok) {
      setValidationError(null);

      await updateRevalidateProduct();
      if (pathname.includes("instagram")) {
        router.push("/instagram/productos");
      } else if (pathname.includes("admin")) {
        router.push("/admin/productos");
      }
    }
  }

  return (
    <main className="w-full p-4 maxsm:p-2 bg-card text-sm">
      {!isSending ? (
        <div className="flex flex-col items-start gap-5 justify-start w-full">
          <section className={`w-full ${!isSending ? "" : "grayscale"}`}>
            <h1 className="w-full text-xl font-semibold text-foreground mb-8 font-EB_Garamond">
              Nuevo Producto Con Variaciones
            </h1>
            <div className="flex flex-row maxmd:flex-col items-start gap-2 justify-between w-full">
              <div className="flex flex-col items-start justify-center">
                <div className="flex flex-row maxmd:flex-col items-center justify-between w-full">
                  {/* Availability */}
                  <div className="mb-4 w-full flex flex-row gap-4 items-center pl-3 uppercase">
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
                {/*  Imagen principal */}
                <div className="gap-y-1 flex-col flex px-2 w-full">
                  <div className="relative aspect-video hover:opacity-80 bg-background border-4 border-gray-300">
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
              </div>

              <div className="w-full flex-col flex justify-start px-2 gap-y-2">
                <div className="mb-1">
                  <p className="text-red-700">
                    {" "}
                    {validationError?.response?._errors.join(", ")}
                  </p>
                  <input
                    type="text"
                    className="appearance-none border bg-card text-card-foreground rounded-md py-2 px-3 border-gray-300 focus:outline-none focus:border-gray-400 w-full"
                    placeholder="Titulo de Producto"
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
                <div className="mb-4">
                  <textarea
                    rows={2}
                    className="appearance-none border bg-card text-card-foreground rounded-md py-2 px-3 border-gray-300 focus:outline-none focus:border-gray-400 w-full"
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
                <div className=" flex flex-row gap-1 items-center">
                  <div className="mb-1  w-full">
                    <input
                      type="text"
                      className="appearance-none border bg-card text-card-foreground rounded-md py-2 px-3 border-gray-300 focus:outline-none focus:border-gray-400 w-full"
                      placeholder="Marca del Producto"
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
                  <div className="mb-1 w-full">
                    <label className="block mb-1 font-EB_Garamond  text-xs">
                      {" "}
                      Género{" "}
                    </label>
                    <div className="relative">
                      <select
                        className="block appearance-none border border-gray-300 bg-card text-card-foreground rounded-md py-2 px-3 cursor-pointer focus:outline-none focus:border-gray-400 w-full"
                        name="gender"
                        onChange={(e) => handleGenderChange(e.target.value)}
                      >
                        {genders?.map((gender) => (
                          <option key={gender.es} value={gender.es}>
                            {gender.es}
                          </option>
                        ))}
                      </select>
                      {validationError?.gender && (
                        <p className="text-sm text-red-400">
                          {validationError.gender._errors.join(", ")}
                        </p>
                      )}
                      <i className="absolute inset-y-0 right-0 p-2 text-gray-400">
                        <svg
                          width="22"
                          height="22"
                          className="fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M7 10l5 5 5-5H7z"></path>
                        </svg>
                      </i>
                    </div>
                  </div>
                </div>
                {/* Etiquetas y Categoria */}
                <div className=" flex flex-row gap-1 items-center">
                  <div className="mb-1 w-full">
                    <label className="block mb-1 font-EB_Garamond  text-xs">
                      Etiquetas
                    </label>
                    <div className="relative">
                      <MultiselectTagComponent
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
                  <div className="mb-1 w-full">
                    <label className="block mb-1 font-EB_Garamond  text-xs">
                      {" "}
                      Categoría{" "}
                    </label>
                    <div className="relative">
                      <select
                        className="block appearance-none border border-gray-400 bg-card text-card-foreground rounded-md pl-2 py-1 focus:outline-none focus:border-gray-400 w-full cursor-pointer"
                        name="category"
                        onChange={(e) => handleCategoryChange(e.target.value)}
                      >
                        {product_categories.map((category) => (
                          <option key={category.es} value={category.es}>
                            {category.es}
                          </option>
                        ))}
                      </select>
                      {validationError?.category && (
                        <p className="text-sm text-red-400">
                          {validationError.category._errors.join(", ")}
                        </p>
                      )}
                      <i className="absolute inset-y-0 right-0 p-2 text-gray-400">
                        <svg
                          width="22"
                          height="22"
                          className="fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M7 10l5 5 5-5H7z"></path>
                        </svg>
                      </i>
                    </div>
                  </div>
                </div>

                <div className="mb-4 w-full flex gap-5 flex-row items-center justify-center">
                  <div className="flex w-full flex-col">
                    <label className="block mb-1 font-EB_Garamond text-xs">
                      Precio de Oferta
                    </label>
                    <div className="relative">
                      <div className="col-span-2">
                        <input
                          type="number"
                          className="appearance-none border border-gray-300 bg-card text-card-foreground rounded-md py-1 px-3 focus:outline-none focus:border-gray-400 w-full remove-arrow "
                          placeholder="0.00"
                          min="0"
                          value={salePrice}
                          onChange={(e: any) => setSalePrice(e.target.value)}
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
                  <div className="mb-1 w-full h-full">
                    <label className="block mb-1 font-EB_Garamond text-xs">
                      Fecha de Fin de Oferta
                    </label>
                    <div className="flex flex-row items-center gap-x-3"></div>
                    <DateTimePicker
                      className={"appearance-none rounded-md"}
                      onChange={onChangeDate}
                      value={salePriceEndDate}
                      locale={"es-MX"}
                      minDate={cstDateTimeClient()}
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
                  <label className="block mb-1 font-EB_Garamond text-xs">
                    {" "}
                    Talla{" "}
                  </label>
                  <div className="relative">
                    <select
                      value={variations[0].size}
                      onChange={(e) => handleSizeChange(0, e.target.value)}
                      name="size"
                      className="appearance-none border border-gray-300 bg-card text-card-foreground rounded-md pl-2 py-1 cursor-pointer focus:outline-none focus:border-gray-400 w-full"
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
                  <label className="block mb-1 font-EB_Garamond text-xs">
                    {" "}
                    Color{" "}
                  </label>
                  <div className="relative">
                    <select
                      value={variations[0].color}
                      name="color"
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
                      className="appearance-none border border-gray-300 bg-card text-card-foreground rounded-md pl-2 py-1 cursor-pointer focus:outline-none focus:border-gray-400 w-full"
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
                  <label className="block mb-1  font-EB_Garamond text-xs">
                    Precio
                  </label>
                  <div className="relative">
                    <div className="col-span-2">
                      <input
                        type="number"
                        className="appearance-none border border-gray-300 bg-card text-card-foreground rounded-md pl-2 py-1 remove-arrow focus:outline-none focus:border-gray-400 w-full"
                        placeholder="0.00"
                        min="1"
                        value={variations[0].price}
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
                  <label className="block mb-1 font-EB_Garamond text-xs">
                    {" "}
                    Costo{" "}
                  </label>
                  <div className="relative">
                    <div className="col-span-2">
                      <input
                        type="number"
                        className="appearance-none border border-gray-300 bg-card text-card-foreground rounded-md pl-2 py-1 remove-arrow focus:outline-none focus:border-gray-400 w-full"
                        placeholder="0.00"
                        min="1"
                        value={variations[0].cost}
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
                  <label className="block mb-1 font-EB_Garamond text-xs">
                    {" "}
                    Existencias{" "}
                  </label>
                  <div className="relative">
                    <div className="col-span-2">
                      <input
                        type="number"
                        className="appearance-none border border-gray-300 bg-card text-card-foreground rounded-md pl-2 py-1 remove-arrow focus:outline-none focus:border-gray-400 w-full"
                        placeholder="1"
                        min="1"
                        value={variations[0].stock}
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
              <div className="mb-4 w-1/3 maxsm:w-full">
                {/* Section 1 - Title, Image */}
                <label className="block  font-EB_Garamond">Imagen # 1</label>
                <div className="relative aspect-video hover:opacity-80 bg-background border-4 border-gray-300">
                  <label htmlFor="selectorVarOne" className="cursor-pointer">
                    <Image
                      id="MainVariation"
                      alt="Main Variation"
                      src={variations[0].image}
                      width={500}
                      height={500}
                      className="w-full h-40 object-cover z-20"
                    />
                    <input
                      id="selectorVarOne"
                      type="file"
                      accept=".png, .jpg, .jpeg, .webp"
                      hidden
                      onChange={(e) => handleVariationImageChange(e, 0)}
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
            {variations.slice(1).map((variation, index) => (
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
                    <label className="block mb-1 font-EB_Garamond text-xs">
                      {" "}
                      Talla{" "}
                    </label>
                    <div className="relative">
                      <select
                        value={variations[index + 1].size}
                        name={`size-${index + 1}`}
                        onChange={(e) =>
                          handleSizeChange(index + 1, e.target.value)
                        }
                        className="appearance-none border border-gray-300 bg-card text-card-foreground rounded-md  pl-2 py-1 cursor-pointer focus:outline-none focus:border-gray-400 w-full"
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
                    <label className="block mb-1 font-EB_Garamond text-xs">
                      {" "}
                      Color{" "}
                    </label>
                    <div className="relative">
                      <select
                        value={variations[index + 1].color}
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
                        className="appearance-none border border-gray-300 bg-card text-card-foreground rounded-md pl-2 py-1 cursor-pointer focus:outline-none focus:border-gray-400 w-full"
                      >
                        {set_colors.map((option) => (
                          <option key={option.value} value={option.value}>
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
                    <label className="block mb-1 font-EB_Garamond text-xs">
                      Precio
                    </label>
                    <div className="relative">
                      <input
                        name={`price-${index + 1}`}
                        type="number"
                        min="0"
                        value={variation.price}
                        onChange={(e) =>
                          handlePriceChange(index + 1, e.target.value)
                        }
                        className="appearance-none border border-gray-300 bg-card text-card-foreground rounded-md  pl-2 py-1 remove-arrow focus:outline-none focus:border-gray-400 w-full"
                      />
                    </div>
                  </div>
                  <div className="mb-4 w-full">
                    <label className="block mb-1 font-EB_Garamond text-xs">
                      {" "}
                      Costo{" "}
                    </label>
                    <div className="relative">
                      <input
                        name={`cost-${index + 1}`}
                        type="number"
                        min="0"
                        value={variation.cost}
                        onChange={(e) =>
                          handleCostChange(index + 1, e.target.value)
                        }
                        className="appearance-none border border-gray-300 bg-card text-card-foreground rounded-md pl-2 py-1 remove-arrow focus:outline-none focus:border-gray-400 w-full"
                      />
                    </div>
                  </div>
                  <div className="mb-4 w-full">
                    <label className="block mb-1 font-EB_Garamond  text-xs">
                      {" "}
                      Existencias{" "}
                    </label>
                    <div className="relative">
                      <input
                        name={`stock-${index + 1}`}
                        type="number"
                        min="0"
                        value={variation.stock}
                        onChange={(e) =>
                          handleStockChange(index + 1, e.target.value)
                        }
                        className="appearance-none border border-gray-300 bg-card text-card-foreground rounded-md pl-2 py-1 remove-arrow focus:outline-none focus:border-gray-400 w-full"
                      />
                    </div>
                  </div>
                </div>
                {/* Dynamic Image Variation */}
                <div className="mb-4 w-1/3 maxsm:w-full">
                  <label className="block  font-EB_Garamond">
                    Imagen # {index + 2}
                  </label>
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
                        className="w-full h-40 object-cover z-20"
                      />
                      <input
                        id={`selector${index + 1}`}
                        type="file"
                        accept=".png, .jpg, .jpeg, .webp"
                        hidden
                        onChange={(e) =>
                          handleVariationImageChange(e, index + 1)
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
            ))}

            <button
              disabled={isSending}
              onClick={hanldeFormSubmit}
              className={`${
                isSending ? "cursor-wait" : ""
              } my-2 cursor-pointer px-4 py-2 text-center inline-block text-white bg-black border border-transparent rounded-md hover:bg-slate-800 w-full`}
            >
              {isSending ? "Creando..." : "Crear Producto"}
            </button>
          </section>
        </div>
      ) : (
        <section className="w-full min-h-screen">
          <div className="flex flex-col items-center justify-center min-h-screen w-full">
            <span className="loader"></span>
            <h2 className="text-sm">Creando producto...</h2>
          </div>
        </section>
      )}
    </main>
  );
};

export default NewVariationOptimized;
