CREATE TABLE IF NOT EXISTS "CourseProduct" (
  "courseId" UUID NOT NULL,
  "productId" UUID NOT NULL,
  CONSTRAINT "CourseProduct_pkey" PRIMARY KEY ("courseId", "productId"),
  CONSTRAINT "CourseProduct_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "CourseProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "CourseProduct_productId_idx" ON "CourseProduct"("productId");
