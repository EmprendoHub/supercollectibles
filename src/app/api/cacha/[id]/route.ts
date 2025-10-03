import { NextRequest, NextResponse } from "next/server";
import CachaRegistration from "@/backend/models/CachaRegistration";
import dbConnect from "@/lib/db";

// GET - Obtener un registro específico por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { id } = params;

    const registration = await CachaRegistration.findById(id).select("-__v");

    if (!registration) {
      return NextResponse.json(
        {
          success: false,
          message: "Registro no encontrado",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: registration,
    });
  } catch (error) {
    console.error("Error al obtener registro:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error al obtener el registro",
      },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar estado de un registro
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { id } = params;
    const body = await request.json();
    const { estado, notificacionesEnviadas } = body;

    // Validar estado
    const estadosValidos = ["pendiente", "confirmado", "asistio", "cancelado"];
    if (estado && !estadosValidos.includes(estado)) {
      return NextResponse.json(
        {
          success: false,
          message: "Estado no válido",
        },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (estado) updateData.estado = estado;
    if (typeof notificacionesEnviadas === "boolean") {
      updateData.notificacionesEnviadas = notificacionesEnviadas;
    }

    const registration = await CachaRegistration.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select("-__v");

    if (!registration) {
      return NextResponse.json(
        {
          success: false,
          message: "Registro no encontrado",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: registration,
      message: "Registro actualizado correctamente",
    });
  } catch (error) {
    console.error("Error al actualizar registro:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error al actualizar el registro",
      },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un registro
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { id } = params;

    const registration = await CachaRegistration.findByIdAndDelete(id);

    if (!registration) {
      return NextResponse.json(
        {
          success: false,
          message: "Registro no encontrado",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Registro eliminado correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar registro:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error al eliminar el registro",
      },
      { status: 500 }
    );
  }
}
