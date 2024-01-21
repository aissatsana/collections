-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collections" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" VARCHAR(255),
    "user_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "custom_string1_state" BOOLEAN,
    "custom_string1_name" VARCHAR(255),
    "custom_string2_state" BOOLEAN,
    "custom_string2_name" VARCHAR(255),
    "custom_string3_state" BOOLEAN,
    "custom_string3_name" VARCHAR(255),
    "custom_int1_state" BOOLEAN,
    "custom_int1_name" VARCHAR(255),
    "custom_int2_state" BOOLEAN,
    "custom_int2_name" VARCHAR(255),
    "custom_int3_state" BOOLEAN,
    "custom_int3_name" VARCHAR(255),
    "custom_text1_state" BOOLEAN,
    "custom_text1_name" VARCHAR(255),
    "custom_text2_state" BOOLEAN,
    "custom_text2_name" VARCHAR(255),
    "custom_text3_state" BOOLEAN,
    "custom_text3_name" VARCHAR(255),
    "custom_boolean1_state" BOOLEAN,
    "custom_boolean1_name" VARCHAR(255),
    "custom_boolean2_state" BOOLEAN,
    "custom_boolean2_name" VARCHAR(255),
    "custom_boolean3_state" BOOLEAN,
    "custom_boolean3_name" VARCHAR(255),
    "custom_date1_state" BOOLEAN,
    "custom_date1_name" VARCHAR(255),
    "custom_date2_state" BOOLEAN,
    "custom_date2_name" VARCHAR(255),
    "custom_date3_state" BOOLEAN,
    "custom_date3_name" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "hasitems" BOOLEAN DEFAULT false,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" SERIAL NOT NULL,
    "item_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "content" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "tags" TEXT,
    "collection_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items_custom_fields" (
    "id" SERIAL NOT NULL,
    "item_id" INTEGER NOT NULL,
    "field_type" VARCHAR(255) NOT NULL,
    "field_name" VARCHAR(255) NOT NULL,
    "field_value" TEXT NOT NULL,

    CONSTRAINT "items_custom_fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "likes" (
    "id" SERIAL NOT NULL,
    "item_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(255),
    "email" VARCHAR(255),
    "password" VARCHAR(255),
    "status" VARCHAR(255) DEFAULT 'active',
    "role" VARCHAR(255) DEFAULT 'user',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unique_item_field" ON "items_custom_fields"("item_id", "field_name");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_token_key" ON "tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "unique_email" ON "users"("email");

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "fk_category_id" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "fk_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "fk_collection_id" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "items_custom_fields" ADD CONSTRAINT "fk_item_id" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "fk_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
