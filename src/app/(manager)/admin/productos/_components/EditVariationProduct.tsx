"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { cstDateTimeClient } from "@/backend/helpers";
import { updateRevalidateProduct } from "@/app/_actions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  set_colors,
  sizes_prendas,
  sizes_shoes_men,
  cat_tarjetas,
  product_categories,
  genders,
} from "@/backend/data/productData";
import ToggleSwitch from "@/components/layouts/ToggleSwitch";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { toast } from "@/components/ui/use-toast";
import { Loader } from "@/components/loader";
import { ValidationError } from "@/types";

// Modify the extractImageName function to handle potential errors
function extractImageName(url: string | undefined): string {
  if (!url || typeof url !== "string") {
    console.error("Invalid URL provided to extractImageName:", url);
    return "unknown_image";
  }
  const lastSlashIndex = url.lastIndexOf("/");
  return lastSlashIndex !== -1 ? url.substring(lastSlashIndex + 1) : url;
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [brand, setBrand] = useState(product?.brand);
  const [grade, setGrade] = useState(product?.rating);
  const [description, setDescription] = useState(product?.description);
  const [category, setCategory] = useState(product?.category);
  const [gender, setGender] = useState(product?.gender);
  const [featured, setFeatured] = useState(product?.featured);
  const [onlineAvailability, setOnlineAvailability] = useState(
    product?.availability?.online
  );
  const [updatedAt, setUpdatedAt] = useState(
    cstDateTimeClient().toLocaleString()
  );

  const [sizeSelection, setSizeSelection] = useState(sizes_prendas);
  const [sizeSelectionLabel, setSizeSelectionLabel] = useState("Talla");
  const [validationError, setValidationError] =
    useState<ValidationError | null>(null);

  const [mainImage, setMainImage] = useState(product?.images[0].url);

  const [variations, setVariations] = useState(product?.variations);
  const [secondaryImages, setSecondaryImages] = useState(
    product?.images?.slice(1) || []
  );

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
    const newVariations = [...variations];
    newVariations[index].size = newSize;
    setVariations(newVariations);
  };

  const isCombinationUnique = (size: string, color: string, index: number) => {
    return !variations.some(
      (variation: any, i: any) =>
        i !== index && variation.size === size && variation.color === color
    );
  };

  const handlePriceChange = (index: number, newPrice: string) => {
    const newVariations = [...variations];
    newVariations[index].price = newPrice;
    setVariations(newVariations);
  };

  const handleStockChange = (index: number, newStock: string) => {
    const newVariations = [...variations];
    newVariations[index].stock = newStock;
    setVariations(newVariations);
  };

  async function removeImageBackground(file: File) {
    const endpoint = `/api/bgremover/`;

    // Create a FormData object and append the file
    const formData = new FormData();
    formData.append("image", file);

    const newNoBgFile = await fetch(endpoint, {
      method: "POST",
      body: formData, // Send the form data
    });

    const response = await newNoBgFile.json();
    return response.images;
  }

  // Handle image variations change
  const handleVariationImageChange = async (e: any, index: number) => {
    let files = e?.target.files;
    if (files) {
      for (var i = 0; i < files?.length; i++) {
        var file = files[i];
        try {
          const noBgResponse = await removeImageBackground(file);

          if (!noBgResponse || !noBgResponse.url) {
            throw new Error("Background removal failed or no URL provided");
          }

          const imageName = extractImageName(noBgResponse.url);
          const noBgImageUrl = noBgResponse.url;

          console.log("noBgImageUrl", noBgImageUrl);

          const endpoint = `/api/bgremover/`;
          const response = await fetch(endpoint, {
            method: "GET",
            headers: { noBgImageUrl: noBgImageUrl },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const blob = await response.blob();
          console.log("response get blob", blob);

          const noBgFile = new File([blob], `nobg_${imageName}`, {
            type: blob.type || "image/png",
          });

          console.log("noBgFile", noBgFile);

          // Validate file
          if (noBgFile.size === 0) {
            throw new Error("Background removed file is empty");
          }

          // Retrieve a URL from our server and process the image
          await new Promise<void>((resolve, reject) => {
            retrieveNewURL(noBgFile, async (file, url) => {
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
  const upload = async (e: any) => {
    let files = e?.target.files;
    let section = e?.target.id;
    if (files) {
      for (var i = 0; i < files?.length; i++) {
        var file = files[i];

        try {
          setIsProcessing(true);
          const noBgResponse = await removeImageBackground(file);

          if (!noBgResponse || !noBgResponse.url) {
            throw new Error("Background removal failed or no URL provided");
          }

          const imageName = extractImageName(noBgResponse.url);
          const noBgImageUrl = noBgResponse.url;

          const endpoint = `/api/bgremover/`;
          const response = await fetch(endpoint, {
            method: "GET",
            headers: { noBgImageUrl: noBgImageUrl },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const blob = await response.blob();

          const noBgFile = new File([blob], `nobg_${imageName}`, {
            type: blob.type || "image/png",
          });

          // Validate file
          if (noBgFile.size === 0) {
            throw new Error("Background removed file is empty");
          }

          // Retrieve a URL from our server and process the image
          await new Promise<void>((resolve, reject) => {
            retrieveNewURL(noBgFile, async (file, url) => {
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
          setIsProcessing(false);
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

    // Create a canvas element
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Failed to get canvas context");
    }

    let width = img.width;
    let height = img.height;
    const maxDimension = 1024;

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
      })
      .catch((e) => {
        console.error(e);
      });
  }

  const handleMainSecondaryImagesChange = async (e: any, index: number) => {
    let files = e?.target.files;
    if (files) {
      for (var i = 0; i < files?.length; i++) {
        var file = files[i];
        try {
          const noBgResponse = await removeImageBackground(file);

          if (!noBgResponse || !noBgResponse.url) {
            throw new Error("Background removal failed or no URL provided");
          }

          const imageName = extractImageName(noBgResponse.url);
          const noBgImageUrl = noBgResponse.url;

          console.log("noBgImageUrl", noBgImageUrl);

          const endpoint = `/api/bgremover/`;
          const response = await fetch(endpoint, {
            method: "GET",
            headers: { noBgImageUrl: noBgImageUrl },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const blob = await response.blob();
          console.log("response get blob", blob);

          const noBgFile = new File([blob], `nobg_${imageName}`, {
            type: blob.type || "image/png",
          });

          console.log("noBgFile", noBgFile);

          // Validate file
          if (noBgFile.size === 0) {
            throw new Error("Background removed file is empty");
          }

          // Retrieve a URL from our server and process the image
          await new Promise<void>((resolve, reject) => {
            retrieveNewURL(noBgFile, async (file, url) => {
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

  const handleCategoryChange = async (e: any) => {
    setCategory(e);
    if (e === "Calzado") {
      setSizeSelection(sizes_shoes_men);
      setSizeSelectionLabel("Talla");
    }

    if (e === "Tarjetas" || e === "Figuras") {
      setSizeSelection(cat_tarjetas);
      setSizeSelectionLabel("Colección");
    }

    if (e === "Prendas") {
      setSizeSelection(sizes_prendas);
      setSizeSelectionLabel("Talla");
    }
  };

  const handleGenderChange = async (e: any) => {
    setGender(e);
    if (category === "Calzado") {
      setSizeSelection(sizes_shoes_men);
      setSizeSelectionLabel("Talla");
    }

    if (category === "Tarjetas" || category === "Figuras") {
      setSizeSelection(cat_tarjetas);
      setSizeSelectionLabel("Colección");
    }

    if (category === "Prendas") {
      setSizeSelection(sizes_prendas);
      setSizeSelectionLabel("Talla");
    }
  };

  useEffect(() => {
    // handle Gender Change
    setGender(product?.gender);
    if (category === "Calzado") {
      setSizeSelection(sizes_shoes_men);
    }

    if (category === "Prendas") {
      setSizeSelection(sizes_prendas);
    }

    if (product?.category === "Tarjetas" || product?.category === "Figuras") {
      setSizeSelection(cat_tarjetas);
    }

    // eslint-disable-next-line
  }, []);

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

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("featured", featured);
    formData.append("onlineAvailability", onlineAvailability);
    formData.append("brand", brand);
    formData.append("grade", grade.toString());
    formData.append("secondaryImages", JSON.stringify(secondaryImages));
    formData.append("gender", gender);
    formData.append("mainImage", mainImage);
    formData.append("variations", JSON.stringify(variations));
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

  return (
    <main className="w-full p-4 maxsm:p-2 bg-background">
      {!isSending ? (
        <div className="flex flex-col items-start gap-5 justify-start w-full">
          <section className="w-full ">
            <div className="flex flex-row maxmd:flex-col items-center justify-between">
              <h1 className="w-full text-2xl font-semibold text-foreground mb-8 font-EB_Garamond">
                Actualizar Producto
              </h1>
              {/* Availability */}
              <div className="mb-4 w-full flex flex-row gap-4 items-center uppercase">
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
            </div>

            <div className="flex flex-row maxmd:flex-col items-start gap-3 justify-between w-full">
              <div className="gap-y-1 flex-col flex px-2 w-full">
                {/*  Imagen principal del Producto */}
                <Loader loading={isProcessing}>{""}</Loader>
                <div
                  className={`relative aspect-video ${
                    isProcessing ? "opacity-10 " : "hover:opacity-80 "
                  } bg-background border-4 border-gray-300`}
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
                <div className="flex flex-row gap-2 items-center justify-start w-full">
                  {secondaryImages.slice(1).map((image: any) => (
                    <div
                      key={image.id}
                      className={`relative aspect-video h-32 w-32 ${
                        isProcessing ? "opacity-10 " : "hover:opacity-80 "
                      } bg-background border-4 border-gray-300`}
                    >
                      <label
                        htmlFor="selectorMainTwo"
                        className={`${
                          isProcessing ? "cursor-not-allowed" : "cursor-pointer"
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

              <div className="w-full flex-col flex justify-start px-2 gap-y-2">
                <div className="mb-1">
                  <label className="block mb-1  font-EB_Garamond">
                    Titulo del Producto
                  </label>
                  <input
                    type="text"
                    className="appearance-none border bg-background rounded-xl py-2 px-3 border-gray-300 focus:outline-none focus:border-gray-400 w-full"
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
                    className="appearance-none border  bg-background rounded-xl py-2 px-3 border-gray-300 focus:outline-none focus:border-gray-400 w-full"
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
                <div className=" flex flex-col items-center gap-3">
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
                          step="any" // Allows decimal values
                          className="appearance-none border bg-card text-card-foreground rounded-xl py-2 px-3 border-gray-300 focus:outline-none focus:border-gray-400 w-full"
                          placeholder="Grado ej. 9.5"
                          value={grade}
                          onChange={(e: any) => setGrade(e.target.value)}
                          name="grade"
                          inputMode="decimal" // Enhances mobile keyboard for decimal input
                          style={{
                            MozAppearance: "textfield", // For Firefox
                          }}
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
                      Tipo
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
                  <div className="mb-1 w-full">
                    <label className="block mb-1 font-EB_Garamond  text-xs">
                      {" "}
                      Categoría{" "}
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
                      <i className="absolute inset-y-0 right-0 p-2  text-gray-400">
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
                    {" "}
                    {sizeSelectionLabel}{" "}
                  </label>
                  <div className="relative">
                    <select
                      value={variations[0]?.size}
                      name="size"
                      onChange={(e) => handleSizeChange(0, e.target.value)}
                      className="appearance-none border bg-input rounded-xl py-2 px-3 border-gray-300 focus:outline-none focus:border-gray-400 w-full"
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
                    <div className="col-span-2">
                      <input
                        type="number"
                        className="appearance-none border bg-input rounded-xl py-2 px-3 border-gray-300 focus:outline-none focus:border-gray-400 w-full"
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
                  <label className="block mb-1 font-EB_Garamond text-xs">
                    {" "}
                    Existencias{" "}
                  </label>
                  <div className="relative">
                    <div className="col-span-2">
                      <input
                        type="number"
                        className="appearance-none border bg-input rounded-xl py-2 px-3 border-gray-300 focus:outline-none focus:border-gray-400 w-full"
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
                <div className="relative aspect-video hover:opacity-80 bg-background border-2 border-gray-300 w-40 h-40 rounded-xl overflow-hidden ml-3">
                  <label htmlFor="selectorVarOne" className="cursor-pointer">
                    <Image
                      id="MainVariation"
                      alt="Main Variation"
                      src={variations[0]?.image}
                      width={250}
                      height={250}
                      className="w-full h-full object-cover z-20"
                    />
                    <input
                      id="selectorVarOne"
                      type="file"
                      accept=".png, .jpg, .jpeg, .webp"
                      hidden
                      onChange={(e: any) =>
                        handleVariationImageChange(e, e.target.files[0])
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

                    <div className="flex flex-row items-center gap-3">
                      <div className="mb-4 w-full">
                        <label className="block mb-1 font-EB_Garamond text-xs">
                          {sizeSelectionLabel}
                        </label>
                        <div className="relative">
                          <select
                            value={variation.size}
                            name={`size-${index + 1}`}
                            onChange={(e) =>
                              handleSizeChange(index + 1, e.target.value)
                            }
                            className="appearance-none border bg-input rounded-xl py-2 px-3 border-gray-300 focus:outline-none focus:border-gray-400 w-full"
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
                            type="number"
                            min="0"
                            value={variation.price}
                            name={`price-${index + 1}`}
                            onChange={(e) =>
                              handlePriceChange(index + 1, e.target.value)
                            }
                            className="appearance-none border bg-input rounded-xl py-2 px-3 border-gray-300 focus:outline-none focus:border-gray-400 w-full"
                          />
                        </div>
                      </div>

                      <div className="mb-4 w-full">
                        <label className="block mb-1 font-EB_Garamond text-xs">
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
                            className="appearance-none border bg-input rounded-xl py-2 px-3 border-gray-300 focus:outline-none focus:border-gray-400 w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Dynamic Image Variation */}
                  <div className="mb-4 w-1/3 maxsm:w-full">
                    <div className="relative aspect-video hover:opacity-80 bg-background border-2 border-gray-300 w-40 h-40 maxmd:w-full maxsm:h-60 rounded-xl overflow-hidden ml-3">
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
                          onChange={(e: any) =>
                            handleVariationImageChange(
                              e.target.files[0],
                              index + 1
                            )
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
              } my-2 cursor-pointer px-4 py-2 text-center inline-block text-white bg-black border border-transparent rounded-xl hover:bg-slate-800 w-full`}
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
