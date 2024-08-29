import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/backend/models/Product";
import { getToken } from "next-auth/jwt";
import { generateUrlSafeTitle, newCSTDate } from "@/backend/helpers";

export async function POST(request: any, res: any) {
  const token: any = await getToken({ req: request });
  if (!token) {
    // Return immediately if not authorized
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    await dbConnect();
    const payload = await request.formData();
    let {
      title,
      description,
      category,
      tags,
      featured,
      branchAvailability,
      instagramAvailability,
      onlineAvailability,
      mainImage,
      brand,
      gender,
      variations,
      salePrice,
      salePriceEndDate,
      createdAt,
    } = Object.fromEntries(payload);

    let slug = generateUrlSafeTitle(title);

    let slugExists = await Product.findOne({ slug });

    // Attempt to generate a new unique slug if the original one is already in use
    while (slugExists) {
      const randomNum = Math.floor(1000 + Math.random() * 9000); // Generates a four-digit number
      const newTitle = `${title} Mod-${randomNum}`;
      title = newTitle;
      slug = generateUrlSafeTitle(newTitle);
      slugExists = await Product.findOne({ slug });
    }

    const user = { _id: token?.user?._id };
    // Parse variations JSON string with reviver function to convert numeric strings to numbers
    let colors: any[] = [];
    variations = JSON.parse(variations, (key, value) => {
      if (key === "color") {
        const color = {
          value: value,
          label: value,
        };
        //check array of object to see if values exists
        const exists = colors.some(
          (c) => c.value === value || c.label === value
        );
        if (!exists) {
          colors.push(color); // add to colors array
        }
      }
      // Check if the value is a string and represents a number
      if (!isNaN(value) && value !== "" && !Array.isArray(value)) {
        if (key != "size") {
          return Number(value); // Convert the string to a number
        }
      }
      return value; // Return unchanged for other types of values
    });

    tags = JSON.parse(tags);
    const sale_price = Number(salePrice);
    const sale_price_end_date = salePriceEndDate;
    const images = [{ url: mainImage }];

    // calculate product stock
    const stock = variations.reduce(
      (total: any, variation: any) => total + variation.stock,
      0
    );

    createdAt = newCSTDate();

    const availability = {
      instagram: instagramAvailability,
      branch: branchAvailability,
      online: onlineAvailability,
    };

    const newProduct = new Product({
      type: "variation",
      title,
      slug,
      description,
      featured,
      availability,
      brand,
      gender,
      category,
      tags,
      images,
      colors,
      variations,
      stock,
      sale_price,
      sale_price_end_date,
      createdAt,
      user,
    });

    // Save the Product to the database
    await newProduct.save();
    return new Response(
      JSON.stringify({
        message: "Producto creado exitosamente",
        success: true,
      }),
      {
        status: 200, // Use HTTP 200 to indicate success
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.log(error);

    return new Response(
      JSON.stringify({
        error: "Error al crear Producto",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function PUT(request: any, res: any) {
  const token: any = await getToken({ req: request });

  if (!token) {
    // Return immediately if not authorized
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    await dbConnect();
    const payload = await request.formData();
    let {
      title,
      description,
      category,
      tags,
      featured,
      branchAvailability,
      instagramAvailability,
      onlineAvailability,
      mainImage,
      brand,
      gender,
      variations,
      salePrice,
      salePriceEndDate,
      updatedAt,
      _id,
    } = Object.fromEntries(payload);

    let slug = generateUrlSafeTitle(title);
    let slugExists = await Product.findOne({
      slug: slug,
      _id: { $ne: _id },
    });

    // Attempt to generate a new unique slug if the original one is already in use
    while (slugExists) {
      const randomNum = Math.floor(1000 + Math.random() * 9000); // Generates a four-digit number
      const newTitle = `${title} Mod-${randomNum}`;
      title = newTitle;
      slug = generateUrlSafeTitle(newTitle);
      slugExists = await Product.findOne({ slug });
    }

    const user = { _id: token?.user?._id };

    // Parse variations JSON string with reviver function to convert numeric strings to numbers
    let colors: any[] = [];
    variations = JSON.parse(variations, (key, value) => {
      if (key === "color") {
        const color = {
          value: value,
          label: value,
        };
        //check array of object to see if values exists
        const exists = colors.some(
          (c) => c.value === value || c.label === value
        );
        if (!exists) {
          colors.push(color); // add to colors array
        }
      }
      // Check if the value is a string and represents a number
      if (!isNaN(value) && value !== "" && !Array.isArray(value)) {
        if (key != "size") {
          return Number(value); // Convert the string to a number
        }
      }
      return value; // Return unchanged for other types of values
    });

    tags = JSON.parse(tags);
    const sale_price = Number(salePrice);
    const sale_price_end_date = salePriceEndDate;
    const images = [{ url: mainImage }];

    // calculate product stock
    const stock = variations.reduce(
      (total: any, variation: any) => total + variation.stock,
      0
    );

    updatedAt = new Date(updatedAt);

    const availability = {
      instagram: instagramAvailability,
      branch: branchAvailability,
      online: onlineAvailability,
    };

    // Update a Product in the database
    await Product.updateOne(
      { _id },
      {
        type: "variation",
        title,
        slug,
        description,
        featured,
        availability,
        brand,
        gender,
        category,
        tags,
        images,
        colors,
        variations,
        stock,
        sale_price,
        sale_price_end_date,
        updatedAt,
        user,
      }
    );
    const response = NextResponse.json({
      message: "Producto actualizado exitosamente",
      success: true,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error al crear Producto",
      },
      { status: 500 }
    );
  }
}
