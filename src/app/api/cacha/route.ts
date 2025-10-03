import { NextRequest, NextResponse } from "next/server";
import CachaRegistration from "@/backend/models/CachaRegistration";
import dbConnect from "@/lib/db";
import {
  sendCachaConfirmationEmail,
  sendAdminNotificationEmail,
} from "@/backend/helpers/emailService";

export async function POST(request: NextRequest) {
  try {
    // Conectar a la base de datos
    await dbConnect();

    const body = await request.json();
    const { nombre, email, telefono, edad, mensaje } = body;

    // Validación básica
    if (!nombre || !email || !telefono || !edad) {
      return NextResponse.json(
        {
          success: false,
          message: "Todos los campos obligatorios deben estar completos",
        },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "El formato del email no es válido",
        },
        { status: 400 }
      );
    }

    // Validar edad
    const edadNum = parseInt(edad);
    if (isNaN(edadNum) || edadNum < 13 || edadNum > 100) {
      return NextResponse.json(
        {
          success: false,
          message: "La edad debe estar entre 13 y 100 años",
        },
        { status: 400 }
      );
    }

    // Verificar si el email ya está registrado
    const existingRegistration = await CachaRegistration.findOne({
      email: email.toLowerCase().trim(),
    });
    if (existingRegistration) {
      return NextResponse.json(
        {
          success: false,
          message: "Este email ya está registrado para el evento",
        },
        { status: 409 }
      );
    }

    // Crear nuevo registro
    const newRegistration = new CachaRegistration({
      nombre: nombre.trim(),
      email: email.toLowerCase().trim(),
      telefono: telefono.trim(),
      edad: edadNum,
      mensaje: mensaje ? mensaje.trim() : "",
    });

    await newRegistration.save();

    // Enviar email de confirmación al usuario
    try {
      await sendCachaConfirmationEmail({
        nombre: newRegistration.nombre,
        email: newRegistration.email,
        codigoConfirmacion: newRegistration.codigoConfirmacion!,
        fechaRegistro: newRegistration.fechaRegistro,
      });
      console.log(
        "Email de confirmación enviado exitosamente a:",
        newRegistration.email
      );
    } catch (emailError) {
      console.error("Error al enviar email de confirmación:", emailError);
    }

    // Enviar notificación a administradores
    try {
      await sendAdminNotificationEmail({
        nombre: newRegistration.nombre,
        email: newRegistration.email,
        telefono: newRegistration.telefono,
        edad: newRegistration.edad,
        mensaje: newRegistration.mensaje,
        codigoConfirmacion: newRegistration.codigoConfirmacion!,
        fechaRegistro: newRegistration.fechaRegistro,
      });
      console.log("Notificación admin enviada exitosamente");
    } catch (adminEmailError) {
      console.error("Error al enviar notificación admin:", adminEmailError);
    }

    // Respuesta exitosa (sin incluir datos sensibles)
    return NextResponse.json(
      {
        success: true,
        message:
          "Registro exitoso para el Meet & Greet con Cacha. Revisa tu email para la confirmación.",
        data: {
          id: newRegistration._id,
          nombre: newRegistration.nombre,
          email: newRegistration.email,
          codigoConfirmacion: newRegistration.codigoConfirmacion,
          fechaRegistro: newRegistration.fechaRegistro,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error al procesar registro de Cacha:", error);

    // Manejo de errores específicos de MongoDB
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "Este email ya está registrado para el evento",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor. Por favor, intenta de nuevo.",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Conectar a la base de datos
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const estado = searchParams.get("estado");

    // Filtros
    const filter: any = {};
    if (
      estado &&
      ["pendiente", "confirmado", "asistio", "cancelado"].includes(estado)
    ) {
      filter.estado = estado;
    }

    // Paginación
    const skip = (page - 1) * limit;

    // Obtener registros
    const registrations = await CachaRegistration.find(filter)
      .select("-__v") // Excluir campo __v
      .sort({ fechaRegistro: -1 })
      .skip(skip)
      .limit(limit);

    // Contar total de registros
    const total = await CachaRegistration.countDocuments(filter);

    // Obtener estadísticas
    const estadisticas = await CachaRegistration.aggregate([
      {
        $group: {
          _id: "$estado",
          count: { $sum: 1 },
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      data: {
        registrations,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
        estadisticas,
      },
    });
  } catch (error) {
    console.error("Error al obtener registros de Cacha:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error al obtener los registros",
      },
      { status: 500 }
    );
  }
}
