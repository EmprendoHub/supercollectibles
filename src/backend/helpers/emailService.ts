import nodemailer from "nodemailer";

interface EmailData {
  nombre: string;
  email: string;
  codigoConfirmacion: string;
  fechaRegistro: Date;
}

interface AdminNotificationData {
  nombre: string;
  email: string;
  telefono: string;
  edad: number;
  mensaje?: string;
  codigoConfirmacion: string;
  fechaRegistro: Date;
}

export async function sendCachaConfirmationEmail({
  nombre,
  email,
  codigoConfirmacion,
  fechaRegistro,
}: EmailData) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GOOGLE_MAIL,
        pass: process.env.GOOGLE_MAIL_PASS,
      },
    });

    const fechaFormateada = new Date(fechaRegistro).toLocaleDateString(
      "es-MX",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );

    const subject = "🎉 ¡Confirmación de registro - Meet & Greet con Cacha!";
    const senderEmail = "supercollectibles214@gmail.com";

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmación de Registro - Meet & Greet con Cacha</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 30px;
          text-align: center;
          color: white;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: bold;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        .header p {
          margin: 10px 0 0;
          font-size: 16px;
          opacity: 0.9;
        }
        .emoji {
          font-size: 48px;
          margin-bottom: 15px;
          display: block;
        }
        .content {
          padding: 40px 30px;
        }
        .greeting {
          font-size: 20px;
          color: #667eea;
          margin-bottom: 20px;
          font-weight: bold;
        }
        .message {
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 25px;
          color: #555;
        }
        .details-box {
          background: linear-gradient(135deg, #f8f9ff 0%, #e8ebff 100%);
          border-radius: 10px;
          padding: 25px;
          margin: 25px 0;
          border-left: 5px solid #667eea;
        }
        .details-title {
          font-size: 18px;
          font-weight: bold;
          color: #667eea;
          margin-bottom: 15px;
        }
        .detail-item {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          font-size: 14px;
        }
        .detail-icon {
          margin-right: 10px;
          font-size: 16px;
        }
        .confirmation-code {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          font-size: 18px;
          font-weight: bold;
          letter-spacing: 2px;
          margin: 20px 0;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        .event-info {
          background: #f0f4ff;
          border-radius: 10px;
          padding: 20px;
          margin: 25px 0;
        }
        .event-title {
          font-size: 16px;
          font-weight: bold;
          color: #333;
          margin-bottom: 15px;
          text-align: center;
        }
        .event-item {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          font-size: 14px;
        }
        .footer {
          background: #f8f9fa;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #eee;
        }
        .footer-logo {
          font-size: 18px;
          font-weight: bold;
          color: #667eea;
          margin-bottom: 10px;
        }
        .footer-text {
          font-size: 12px;
          color: #666;
          line-height: 1.4;
        }
        .social-links {
          margin: 15px 0;
        }
        .social-links a {
          text-decoration: none;
          color: #667eea;
          margin: 0 10px;
          font-size: 14px;
        }
        @media (max-width: 600px) {
          .container {
            margin: 0;
            border-radius: 0;
          }
          .header, .content, .footer {
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <span class="emoji">🎉</span>
          <h1>¡Registro Confirmado!</h1>
          <p>Meet & Greet con Cacha</p>
        </div>

        <!-- Content -->
        <div class="content">
          <div class="greeting">¡Hola ${nombre}! 👋</div>
          
          <div class="message">
            ¡Felicidades! Tu registro para el <strong>Meet & Greet con Cacha</strong> ha sido confirmado exitosamente. 
            Estamos emocionados de tenerte en este evento exclusivo.
          </div>

          <!-- Confirmation Code -->
          <div class="confirmation-code">
            Código de Confirmación: ${codigoConfirmacion}
          </div>

          <!-- Registration Details -->
          <div class="details-box">
            <div class="details-title">📋 Detalles de tu Registro</div>
            <div class="detail-item">
              <span class="detail-icon">👤</span>
              <strong>Nombre:</strong> &nbsp;${nombre}
            </div>
            <div class="detail-item">
              <span class="detail-icon">📧</span>
              <strong>Email:</strong> &nbsp;${email}
            </div>
            <div class="detail-item">
              <span class="detail-icon">📅</span>
              <strong>Fecha de registro:</strong> &nbsp;${fechaFormateada}
            </div>
            <div class="detail-item">
              <span class="detail-icon">🎫</span>
              <strong>Estado:</strong> &nbsp;Confirmado
            </div>
          </div>

          <!-- Event Information -->
          <div class="event-info">
            <div class="event-title">🎪 Información del Evento</div>
            <div class="event-item">
              <span class="detail-icon">🎵</span>
              Música en vivo by LLOVET
            </div>
            <div class="event-item">
              <span class="detail-icon">👕</span>
              Drop oficial de merchandise exclusivo
            </div>
            <div class="event-item">
              <span class="detail-icon">📸</span>
              Sesión de fotos y autógrafos con Cacha
            </div>
            <div class="event-item">
              <span class="detail-icon">🎁</span>
              Sorpresas y actividades especiales
            </div>
          </div>

          <div class="message">
            <strong>📍 Próximos pasos:</strong><br>
            • Te esperamos este Sábado 01 de Noviembre a las 2:00 PM en El Centro Magno - Av. Ignacio L Vallarta 2425, Arcos Vallarta, 44130 Guadalajara, Jal.<br>
            • Guarda tu código de confirmación para el acceso al evento<br>
            • Mantente atento a tu email para más información<br>
            • Síguenos en redes sociales para actualizaciones
          </div>

          <div class="message">
            <strong>💝 ¿Tienes preguntas?</strong><br>
            No dudes en contactarnos a través de nuestros canales oficiales. 
            ¡Estamos aquí para hacer de este evento una experiencia inolvidable!
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <div class="footer-logo">Super Collectibles</div>
          <div class="social-links">
            <a href="https://www.supercollectibles.com.mx">🌐 Sitio Web</a>
            <a href="https://www.instagram.com/supercollectibles_mx">📱 Instagram</a>
            <a href="https://www.facebook.com/profile.php?id=61564208924734">📘 Facebook</a>
          </div>
          <div class="footer-text">
            Este es un email automático de confirmación.<br>
            Por favor, no respondas a este mensaje.<br>
            <br>
            <strong>Super Collectibles</strong><br>
            www.supercollectibles.com.mx<br>
            ¡Creciendo tu colección, un evento a la vez! 🚀
          </div>
        </div>
      </div>
    </body>
    </html>
    `;

    const mailOptions = {
      from: `"Super Collectibles - Evento Cacha" <${senderEmail}>`,
      to: email,
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: "Email de confirmación enviado exitosamente",
    };
  } catch (error) {
    console.error("Error al enviar email de confirmación:", error);
    return {
      success: false,
      message: "Error al enviar email de confirmación",
      error,
    };
  }
}

export async function sendAdminNotificationEmail({
  nombre,
  email,
  telefono,
  edad,
  mensaje,
  codigoConfirmacion,
  fechaRegistro,
}: AdminNotificationData) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GOOGLE_MAIL,
        pass: process.env.GOOGLE_MAIL_PASS,
      },
    });

    const fechaFormateada = new Date(fechaRegistro).toLocaleDateString(
      "es-MX",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );

    const subject = "🎉 Nuevo registro para Meet & Greet con Cacha";
    const senderEmail = "supercollectibles214@gmail.com";
    const adminEmail = process.env.ADMIN_EMAIL || senderEmail;

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nuevo Registro - Meet & Greet con Cacha</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 20px;
          background: #f5f5f5;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 30px;
          text-align: center;
          color: white;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 30px;
        }
        .info-box {
          background: #f8f9ff;
          border-left: 4px solid #667eea;
          padding: 20px;
          margin: 20px 0;
          border-radius: 0 8px 8px 0;
        }
        .info-row {
          display: flex;
          margin-bottom: 10px;
          font-size: 14px;
        }
        .info-label {
          font-weight: bold;
          width: 120px;
          color: #667eea;
        }
        .info-value {
          flex: 1;
        }
        .message-box {
          background: #fff9e6;
          border: 1px solid #ffd700;
          padding: 15px;
          border-radius: 8px;
          margin: 15px 0;
        }
        .footer {
          background: #f8f9fa;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎯 Nuevo Registro Recibido</h1>
          <p>Meet & Greet con Cacha</p>
        </div>
        
        <div class="content">
          <p><strong>¡Hola Admin!</strong></p>
          <p>Se ha registrado una nueva persona para el evento Meet & Greet con Cacha.</p>
          
          <div class="info-box">
            <h3 style="margin-top: 0; color: #667eea;">📋 Información del Participante</h3>
            <div class="info-row">
              <span class="info-label">Nombre:</span>
              <span class="info-value">${nombre}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email:</span>
              <span class="info-value">${email}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Teléfono:</span>
              <span class="info-value">${telefono}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Edad:</span>
              <span class="info-value">${edad} años</span>
            </div>
            <div class="info-row">
              <span class="info-label">Código:</span>
              <span class="info-value"><strong>${codigoConfirmacion}</strong></span>
            </div>
            <div class="info-row">
              <span class="info-label">Registro:</span>
              <span class="info-value">${fechaFormateada}</span>
            </div>
          </div>
          
          ${
            mensaje
              ? `
          <div class="message-box">
            <h4 style="margin-top: 0;">💬 Mensaje para Cacha:</h4>
            <p style="margin-bottom: 0; font-style: italic;">"${mensaje}"</p>
          </div>
          `
              : ""
          }
          
          <p><strong>📊 Próximos pasos:</strong></p>
          <ul>
            <li>El participante ha recibido un email de confirmación automáticamente</li>
            <li>Su código de confirmación es: <strong>${codigoConfirmacion}</strong></li>
            <li>Revisa el panel de admin para gestionar todos los registros</li>
          </ul>
        </div>
        
        <div class="footer">
          <p>Sistema de registro automático - Super Collectibles</p>
          <p>www.supercollectibles.com.mx</p>
        </div>
      </div>
    </body>
    </html>
    `;

    const mailOptions = {
      from: `"Sistema Cacha Event" <${senderEmail}>`,
      to: adminEmail,
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: "Notificación admin enviada exitosamente",
    };
  } catch (error) {
    console.error("Error al enviar notificación admin:", error);
    return {
      success: false,
      message: "Error al enviar notificación admin",
      error,
    };
  }
}
