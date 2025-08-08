"use client";
import React, { useState } from "react";
import Image from "next/image";
import { cstDateTimeClient } from "@/backend/helpers";
import { updateRevalidateProduct } from "@/app/_actions";
import { usePathname, useRouter } from "next/navigation";
import {
  cat_tarjetas,
  cat_articulos,
  cat_misc,
  sizes_shoes_men,
  sizes_prendas,
  product_categories,
  genders,
} from "@/backend/data/productData";
import ToggleSwitch from "@/components/layouts/ToggleSwitch";
import { toast } from "@/components/ui/use-toast";
import { ValidationError } from "@/types";
import { Loader } from "@/components/loader";
import convertor from "@/lib/convertor";

// Modify the extractImageName function to handle potential errors
function extractImageName(url: string | undefined): string {
  if (!url || typeof url !== "string") {
    console.error("Invalid URL provided to extractImageName:", url);
    return "unknown_image";
  }
  const lastSlashIndex = url.lastIndexOf("/");
  return lastSlashIndex !== -1 ? url.substring(lastSlashIndex + 1) : url;
}

const NewVariationOptimized = ({
  currentCookies,
}: {
  currentCookies: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [title, setTitle] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageText, setImageText] = useState<Array<string>>([]);
  const [brand, setBrand] = useState("");
  const [grade, setGrade] = useState(0);
  const [onlineAvailability, setOnlineAvailability] = useState(true);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Tarjetas Coleccionables");
  const [gender, setGender] = useState("Nintendo");
  const [franquicia, setFranquicia] = useState("Nintendo");
  const [featured, setFeatured] = useState(false);
  const [createdAt, setCreatedAt] = useState(
    cstDateTimeClient().toLocaleString()
  );
  const [sizeSelection, setSizeSelection] = useState(cat_tarjetas);
  const [sizeSelectionLabel, setSizeSelectionLabel] = useState("Colección");
  const [validationError, setValidationError] =
    useState<ValidationError | null>(null);
  const [mainImage, setMainImage] = useState(
    "/images/product-placeholder-minimalist.jpg"
  );
  const [secondaryImages, setSecondaryImages] = useState([
    { id: 0, url: "/images/product-placeholder-minimalist.jpg" },
    { id: 1, url: "/images/product-placeholder-minimalist.jpg" },
    { id: 2, url: "/images/product-placeholder-minimalist.jpg" },
  ]);

  const [mainVariation, setMainVariation] = useState(
    "/images/product-placeholder-minimalist.jpg"
  );

  const [variations, setVariations] = useState([
    {
      size: "Pokemon",
      color: "",
      colorHex: "",
      colorHexTwo: "",
      colorHexThree: "",
      price: 0,
      cost: 1,
      stock: 1,
      image: "/images/product-placeholder-minimalist.jpg",
    },
  ]);

  const addVariation = () => {
    setVariations((prevVariations) => [
      ...prevVariations,
      {
        size: "Pokemon",
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

  const handlePriceChange = (index: number, newPrice: string | number) => {
    const newVariations: any = [...variations];
    newVariations[index].price = newPrice;
    setVariations(newVariations);
  };

  const handleStockChange = (index: number, newStock: string | number) => {
    const newVariations: any = [...variations];
    newVariations[index].stock = newStock;
    setVariations(newVariations);
  };

  // Handle image variations change
  const handleVariationImageChange = async (e: any, index: number) => {
    let files = e?.target.files;
    if (files) {
      for (var i = 0; i < files?.length; i++) {
        var file = files[i];
        try {
          // Retrieve a URL from our server and process the image
          await new Promise<void>((resolve, reject) => {
            retrieveNewURL(file, async (file, url) => {
              try {
                const parsed = JSON.parse(url);
                url = parsed.url;
                console.log("file, url", file, url);
                await compressAndOptimizeImage(file, url, index);
                resolve();
              } catch (error) {
                reject(error);
              }
            });
          });
        } catch (error) {
          console.error("Error during variation image upload:", error);
          // Handle the error appropriately, maybe show a user-friendly message
        }
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
      const quality = 0.9; // Adjust quality value as needed
      const compressedImageData = canvas.toDataURL("image/webp", quality);

      // Convert base64 data URL to Blob
      const blobData = await fetch(compressedImageData).then((res) =>
        res.blob()
      );

      // Upload the compressed image
      uploadVariationFile(blobData, url, index);
    };
  }

  const handleMainSecondaryImagesChange = async (e: any, index: number) => {
    let files = e?.target.files;
    if (files) {
      for (var i = 0; i < files?.length; i++) {
        var file = files[i];
        try {
          // Retrieve a URL from our server and process the image
          await new Promise<void>((resolve, reject) => {
            retrieveNewURL(file, async (file, url) => {
              try {
                const parsed = JSON.parse(url);
                url = parsed.url;
                console.log("file, url", file, url);
                await compressAndOptimizeSecondaryImage(file, url, index);
                resolve();
              } catch (error) {
                reject(error);
              }
            });
          });
        } catch (error) {
          console.error("Error during variation image upload:", error);
          // Handle the error appropriately, maybe show a user-friendly message
        }
      }
    }
  };

  async function compressAndOptimizeSecondaryImage(
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
      const quality = 0.9; // Adjust quality value as needed
      const compressedImageData = canvas.toDataURL("image/webp", quality);

      // Convert base64 data URL to Blob
      const blobData = await fetch(compressedImageData).then((res) =>
        res.blob()
      );

      // Upload the compressed image
      uploadSecondaryFiles(blobData, url, index);
    };
  }

  async function uploadSecondaryFiles(
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
        const newSecondaryImages = [...secondaryImages];
        newSecondaryImages[index].url = newUrl[0];
        setSecondaryImages(newSecondaryImages);
      })
      .catch((e) => {
        console.error(e);
      });
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

  // *******main images**********  //
  const upload = async (e: any) => {
    let files = e?.target.files;
    let section = e?.target.id;
    if (files) {
      for (var i = 0; i < files?.length; i++) {
        var file = files[i];

        try {
          setIsProcessing(true);

          // Retrieve a URL from our server and process the image
          await new Promise<void>((resolve, reject) => {
            retrieveNewURL(file, async (file, url) => {
              try {
                const parsed = JSON.parse(url);
                url = parsed.url;

                await compressAndOptimizeMainImage(file, url, section);
                resolve();
              } catch (error) {
                reject(error);
              }
            });
          });
        } catch (error) {
          console.error("Error during upload:", error);
          setIsProcessing(false);
          // Handle the error appropriately, maybe show a user-friendly message
        }
      }
    }
  };

  async function compressAndOptimizeMainImage(
    file: Blob | MediaSource,
    url: any,
    section: any
  ) {
    const loadImage = (imageUrl: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = document.createElement("img");
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = imageUrl;
      });
    };

    const imageUrl = URL.createObjectURL(file);
    const img = await loadImage(imageUrl);

    await convert(imageUrl);

    // Create a canvas element
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Failed to get canvas context");
    }

    let width = img.width;
    let height = img.height;
    const maxDimension = 1080;

    if (width > height && width > maxDimension) {
      height = Math.round((height * maxDimension) / width);
      width = maxDimension;
    } else if (height > maxDimension) {
      width = Math.round((width * maxDimension) / height);
      height = maxDimension;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);

    const quality = 0.9;
    const compressedImageData = canvas.toDataURL("image/webp", quality);

    const blobData = await fetch(compressedImageData).then((res) => res.blob());
    // Upload the compressed image
    uploadFile(blobData, url, section);
  }

  const convert = async (url: string) => {
    if (url.length) {
      await convertor(url).then((txt: string) => {
        let copyTexts: Array<string> = imageText;
        copyTexts.push(txt);
        setImageText(copyTexts);
      });
    }
  };

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
      .then(async () => {
        // If multiple files are uploaded, append upload status on the next line.
        // document.querySelector(
        //   '#status'
        // ).innerHTML += `<br>Uploaded ${file.name}.`;
        const newUrl = url.split("?");
        const imageUrl = newUrl[0];

        // Call the new API route to generate SEO content
        // const seoResponse = await fetch("/api/textextractor", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({ imageText }),
        // });

        // if (!seoResponse.ok) {
        //   setIsProcessing(false);

        //   throw new Error("Failed to generate SEO content");
        // }

        // const { title, description } = await seoResponse.json();
        // setDescription(description);
        // setTitle(title);

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
        setIsProcessing(false);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  const handleCategoryChange = async (e: any) => {
    setCategory(e);
    if (e.includes("Cartas")) {
      setSizeSelection(cat_tarjetas);
      setSizeSelectionLabel("Condición");
    }

    if (e === "Jerseys Autografiadas" || e === "Ropa de Colección") {
      setSizeSelection(sizes_prendas);
      setSizeSelectionLabel("Talla");
    }

    if (
      e === "Hot Wheels" ||
      e === "Figuras Pokemon" ||
      e === "Memorabilia Deportiva" ||
      e === "Relojes de Colección"
    ) {
      setSizeSelection(cat_articulos);
      setSizeSelectionLabel("Condición");
    }

    if (e === "Artículos de Cuidado" || e === "Organizadores y Estuches") {
      setSizeSelection(cat_misc);
      setSizeSelectionLabel("Detalle");
    }
  };

  const handleGenderChange = async (e: any) => {
    setGender(e);
    if (category === "Calzado") {
      setSizeSelection(sizes_shoes_men);
      setSizeSelectionLabel("Talla");
    }

    if (
      category === "Tarjetas Coleccionables" ||
      category === "Figuras Coleccionables"
    ) {
      setSizeSelection(cat_articulos);
      setSizeSelectionLabel("Condición");
    }

    if (category === "Prendas") {
      setSizeSelection(sizes_prendas);
      setSizeSelectionLabel("Talla");
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
        sizes: { _errors: ["Se requiere un tipo de producto "] },
      };
      setValidationError(noSizesError);
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
      "onlineAvailability",
      onlineAvailability !== undefined ? onlineAvailability.toString() : ""
    );
    formData.append("brand", brand);
    formData.append("grade", grade.toString());
    formData.append("gender", gender);
    formData.append("mainImage", mainImage);
    formData.append("variations", JSON.stringify(variations));
    formData.append("secondaryImages", JSON.stringify(secondaryImages));
    formData.append("createdAt", createdAt);

    // write to database using server actions
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
      if (pathname.includes("admin")) {
        router.push("/admin/productos");
      }
    }
  }

  return (
    <main className="w-full p-4 maxsm:p-2 bg-card text-sm">
      {!isSending ? (
        <div className="flex flex-col items-start gap-5 justify-start w-full">
          <section
            className={`w-full maxsm:pr-5 ${!isSending ? "" : "grayscale"}`}
          >
            <div className="flex flex-row maxmd:flex-col items-start gap-2 justify-between w-full">
              <div className="flex flex-col items-start justify-center">
                <div className="flex flex-row maxmd:flex-col items-center justify-between w-full">
                  <h1 className="w-full text-xl font-semibold text-foreground mb-8 font-EB_Garamond">
                    Nuevo Producto
                  </h1>
                </div>
                {/*  Imagen principal */}
                <Loader loading={isProcessing}>{""}</Loader>
                <div className="gap-y-1 flex-col flex w-full">
                  <div
                    className={`relative aspect-video ${
                      isProcessing ? "opacity-10 " : "hover:opacity-80 "
                    } bg-background border-2 border-gray-300`}
                  >
                    <label
                      htmlFor="selectorMain"
                      className={`${
                        isProcessing ? "cursor-not-allowed" : "cursor-pointer"
                      } `}
                    >
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
                        disabled={isProcessing}
                      />

                      {validationError?.mainImage && (
                        <p className="text-sm text-red-400">
                          {validationError.mainImage._errors.join(", ")}
                        </p>
                      )}
                    </label>
                  </div>
                  <div className="flex flex-row gap-2 items-center justify-center w-full">
                    {secondaryImages.map((image: any) => (
                      <div
                        key={image.id}
                        className={`relative aspect-video ${
                          isProcessing ? "opacity-10 " : "hover:opacity-80 "
                        } bg-background border-4 border-gray-300`}
                      >
                        <label
                          htmlFor="selectorMainTwo"
                          className={`${
                            isProcessing
                              ? "cursor-not-allowed"
                              : "cursor-pointer"
                          } `}
                        >
                          <Image
                            src={image.url}
                            width={250}
                            height={250}
                            alt="producto"
                          />
                          <input
                            id="selectorMainTwo"
                            type="file"
                            accept=".png, .jpg, .jpeg, .webp"
                            hidden
                            onChange={(e) =>
                              handleMainSecondaryImagesChange(e, image.id)
                            }
                            disabled={isProcessing}
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-full flex-col flex justify-start px-2 gap-y-2">
                {/* Availability */}
                <div className="mb-4 w-full flex flex-row gap-4 items-center pl-3 uppercase">
                  <ToggleSwitch
                    label="Destacado"
                    enabled={featured}
                    setEnabled={setFeatured}
                  />

                  <ToggleSwitch
                    label="WWW"
                    enabled={onlineAvailability}
                    setEnabled={setOnlineAvailability}
                  />
                </div>
                <div className="mb-1">
                  <p className="text-red-700">
                    {" "}
                    {validationError?.response?._errors.join(", ")}
                  </p>
                  <input
                    type="text"
                    className="appearance-none border bg-card text-card-foreground rounded-xl py-2 px-3 border-gray-300 focus:outline-none focus:border-gray-400 w-full"
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
                    className="appearance-none border bg-card text-card-foreground rounded-xl py-2 px-3 border-gray-300 focus:outline-none focus:border-gray-400 w-full"
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
                {/* Certificador y Grado */}
                <div className=" flex flex-col gap-1 items-start">
                  <div className="flex items-center justify-center gap-3">
                    <div className="flex flex-col items-start">
                      <label className="block mb-1 font-EB_Garamond  text-xs">
                        Certificador
                      </label>
                      <div className="mb-1  w-full">
                        <input
                          type="text"
                          className="appearance-none border bg-card text-card-foreground rounded-xl py-2 px-3 border-gray-300 focus:outline-none focus:border-gray-400 w-full"
                          placeholder="Cert. ej. PSA"
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
                    </div>

                    <div className="flex flex-col items-start">
                      <label className="block mb-1 font-EB_Garamond  text-xs">
                        Grado
                      </label>
                      <div className="mb-1  w-full">
                        <input
                          type="number"
                          className="appearance-none border bg-card text-card-foreground rounded-xl py-2 px-3 border-gray-300 focus:outline-none focus:border-gray-400 w-full"
                          placeholder="Grado ej. 9.5"
                          value={grade}
                          onChange={(e: any) => setGrade(e.target.value)}
                          name="grade"
                        />
                        {validationError?.grade && (
                          <p className="text-sm text-red-400">
                            {validationError.grade._errors.join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mb-1 w-full">
                    <label className="block mb-1 font-EB_Garamond  text-xs">
                      Fabricante
                    </label>
                    <div className="relative">
                      <select
                        className="block appearance-none border border-gray-300 bg-card text-card-foreground rounded-xl py-2 px-3 cursor-pointer focus:outline-none focus:border-gray-400 w-full"
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
                      Tipo
                    </label>
                    <div className="relative">
                      <select
                        className="block appearance-none border border-gray-400 bg-card text-card-foreground rounded-xl pl-2 py-2 focus:outline-none focus:border-gray-400 w-full cursor-pointer"
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
              </div>
            </div>
            <div className="w-[300px]">
              <div
                onClick={addVariation}
                className="my-4 px-8 py-2 text-center inline-block text-white bg-black border border-transparent rounded-xl hover:bg-slate-800 w-auto cursor-pointer"
              >
                Variación +
              </div>
            </div>
            {/* Main Variation */}
            <div className="w-full main-variation flex maxsm:flex-col items-center">
              <div className="flex flex-row items-center gap-3 w-2/3  maxsm:w-full">
                <div className="mb-4 w-full">
                  <label className="block mb-1 font-EB_Garamond text-xs">
                    {sizeSelectionLabel}
                  </label>
                  <div className="relative">
                    <select
                      value={variations[0].size}
                      onChange={(e) => handleSizeChange(0, e.target.value)}
                      name="size"
                      className="appearance-none border border-gray-300 bg-card text-card-foreground rounded-xl pl-2 py-1 cursor-pointer focus:outline-none focus:border-gray-400 w-full"
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
                  <label className="block mb-1  font-EB_Garamond text-xs">
                    Precio
                  </label>
                  <div className="relative">
                    <div className="col-span-2">
                      <input
                        type="number"
                        className="appearance-none border border-gray-300 bg-card text-card-foreground rounded-xl pl-2 py-1 remove-arrow focus:outline-none focus:border-gray-400 w-full"
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
                    Existencias{" "}
                  </label>
                  <div className="relative">
                    <div className="col-span-2">
                      <input
                        type="number"
                        className="appearance-none border border-gray-300 bg-card text-card-foreground rounded-xl pl-2 py-1 remove-arrow focus:outline-none focus:border-gray-400 w-full"
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
              <div className="mb-4 w-1/3 maxsm:w-full ml-3">
                {/* Section 1 - Title, Image */}
                <label className="block  font-EB_Garamond">Variación # 1</label>
                <div className="relative aspect-video hover:opacity-80 bg-background border-2 border-gray-300 w-40 h-40 rounded-xl overflow-hidden">
                  <label htmlFor="selectorVarOne" className="cursor-pointer">
                    <Image
                      id="MainVariation"
                      alt="Main Variation"
                      src={variations[0].image}
                      width={250}
                      height={250}
                      className="h-full w-full object-cover z-20"
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
                      {sizeSelectionLabel}
                    </label>
                    <div className="relative">
                      <select
                        value={variations[index + 1].size}
                        name={`size-${index + 1}`}
                        onChange={(e) =>
                          handleSizeChange(index + 1, e.target.value)
                        }
                        className="appearance-none border border-gray-300 bg-card text-card-foreground rounded-xl  pl-2 py-1 cursor-pointer focus:outline-none focus:border-gray-400 w-full"
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
                        className="appearance-none border border-gray-300 bg-card text-card-foreground rounded-xl  pl-2 py-1 remove-arrow focus:outline-none focus:border-gray-400 w-full"
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
                        className="appearance-none border border-gray-300 bg-card text-card-foreground rounded-xl pl-2 py-1 remove-arrow focus:outline-none focus:border-gray-400 w-full"
                      />
                    </div>
                  </div>
                </div>
                {/* Dynamic Image Variation */}
                <div className="mb-4 w-1/3 maxsm:w-full h-full ml-3">
                  <label className="block  font-EB_Garamond">
                    Variación # {index + 2}
                  </label>
                  <div className="relative aspect-video hover:opacity-80 bg-background border-2 border-gray-300 w-40 h-40 maxmd:w-full maxsm:h-60 rounded-xl overflow-hidden">
                    <label
                      htmlFor={`selector${index + 1}`}
                      className="cursor-pointer"
                    >
                      <Image
                        id={`variation-${index + 1}`}
                        alt={`image variation-${index + 1}`}
                        src={variation.image}
                        width={250}
                        height={250}
                        className="w-full h-full object-cover z-20"
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
              } my-2 cursor-pointer px-4 py-2 text-center inline-block text-white bg-black border border-transparent rounded-xl hover:bg-slate-800 w-full`}
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
