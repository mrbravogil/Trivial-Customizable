-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `rol` ENUM('ADMIN', 'PROFESOR') NOT NULL DEFAULT 'PROFESOR',

    UNIQUE INDEX `Usuario_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Partida` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(191) NOT NULL,
    `estado` ENUM('ESPERANDO', 'EN_CURSO', 'FINALIZADA') NOT NULL DEFAULT 'EN_CURSO',
    `profesorId` INTEGER NULL,
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Partida_codigo_key`(`codigo`),
    INDEX `Partida_profesorId_idx`(`profesorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Equipo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `integrantes` VARCHAR(191) NOT NULL,
    `puntos` INTEGER NOT NULL DEFAULT 0,
    `avatar` VARCHAR(191) NULL,
    `avatarMini` VARCHAR(191) NULL,
    `partidaId` INTEGER NOT NULL,
    `respuestasPartidaJson` JSON NULL,
    `quesitosVisitados` JSON NULL,
    `quesitosUnicos` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Equipo_partidaId_idx`(`partidaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Categoria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Categoria_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pregunta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `texto` VARCHAR(191) NOT NULL,
    `dificultad` ENUM('facil', 'media', 'dificil') NOT NULL DEFAULT 'facil',
    `puntuacion` INTEGER NOT NULL DEFAULT 10,
    `categoriaId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Pregunta_categoriaId_idx`(`categoriaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Respuesta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `texto` VARCHAR(191) NOT NULL,
    `esCorrecta` BOOLEAN NOT NULL,
    `explicacion` VARCHAR(191) NULL,
    `preguntaId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Respuesta_preguntaId_idx`(`preguntaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RespuestaPartida` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `equipoId` INTEGER NOT NULL,
    `preguntaId` INTEGER NOT NULL,
    `respuestaId` INTEGER NOT NULL,
    `esCorrecta` BOOLEAN NOT NULL,
    `puntosObtenidos` INTEGER NOT NULL,

    INDEX `RespuestaPartida_equipoId_idx`(`equipoId`),
    INDEX `RespuestaPartida_preguntaId_idx`(`preguntaId`),
    INDEX `RespuestaPartida_respuestaId_idx`(`respuestaId`),
    UNIQUE INDEX `RespuestaPartida_equipoId_preguntaId_key`(`equipoId`, `preguntaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PuntuacionGrupo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `equipoId` INTEGER NOT NULL,
    `partidaId` INTEGER NOT NULL,
    `puntosTotales` INTEGER NOT NULL,

    UNIQUE INDEX `PuntuacionGrupo_equipoId_key`(`equipoId`),
    INDEX `PuntuacionGrupo_equipoId_idx`(`equipoId`),
    INDEX `PuntuacionGrupo_partidaId_idx`(`partidaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Customizable` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pregunta` VARCHAR(191) NOT NULL,
    `opcion1` VARCHAR(191) NOT NULL,
    `opcion2` VARCHAR(191) NOT NULL,
    `opcion3` VARCHAR(191) NOT NULL,
    `opcion4` VARCHAR(191) NOT NULL,
    `respuesta_correcta` VARCHAR(191) NOT NULL,
    `puntuacion` INTEGER NOT NULL DEFAULT 10,
    `explicacion` VARCHAR(191) NULL,
    `esCustom` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RespuestaCustomizable` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `equipoId` INTEGER NOT NULL,
    `customizableId` INTEGER NOT NULL,
    `esCorrecta` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `RespuestaCustomizable_equipoId_idx`(`equipoId`),
    INDEX `RespuestaCustomizable_customizableId_idx`(`customizableId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Partida` ADD CONSTRAINT `Partida_profesorId_fkey` FOREIGN KEY (`profesorId`) REFERENCES `Usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Equipo` ADD CONSTRAINT `Equipo_partidaId_fkey` FOREIGN KEY (`partidaId`) REFERENCES `Partida`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pregunta` ADD CONSTRAINT `Pregunta_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `Categoria`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Respuesta` ADD CONSTRAINT `Respuesta_preguntaId_fkey` FOREIGN KEY (`preguntaId`) REFERENCES `Pregunta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RespuestaPartida` ADD CONSTRAINT `RespuestaPartida_equipoId_fkey` FOREIGN KEY (`equipoId`) REFERENCES `Equipo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RespuestaPartida` ADD CONSTRAINT `RespuestaPartida_preguntaId_fkey` FOREIGN KEY (`preguntaId`) REFERENCES `Pregunta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RespuestaPartida` ADD CONSTRAINT `RespuestaPartida_respuestaId_fkey` FOREIGN KEY (`respuestaId`) REFERENCES `Respuesta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PuntuacionGrupo` ADD CONSTRAINT `PuntuacionGrupo_equipoId_fkey` FOREIGN KEY (`equipoId`) REFERENCES `Equipo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PuntuacionGrupo` ADD CONSTRAINT `PuntuacionGrupo_partidaId_fkey` FOREIGN KEY (`partidaId`) REFERENCES `Partida`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RespuestaCustomizable` ADD CONSTRAINT `RespuestaCustomizable_equipoId_fkey` FOREIGN KEY (`equipoId`) REFERENCES `Equipo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RespuestaCustomizable` ADD CONSTRAINT `RespuestaCustomizable_customizableId_fkey` FOREIGN KEY (`customizableId`) REFERENCES `Customizable`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
