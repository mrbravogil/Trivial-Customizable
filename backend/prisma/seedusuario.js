import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    // Crear el hash de la contraseña
    const hash = await bcrypt.hash('admin123', 10);

    // Crear el usuario
    const usuario = await prisma.usuario.create({
      data: {
        username: 'admin',
        password: hash,
        rol: 'ADMIN'
      }
    });

    console.log('🗝️ Usuario admin creado con éxito:', usuario.username);
  } catch (error) {
    console.error('Error al crear usuario:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
