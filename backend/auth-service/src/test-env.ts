import "dotenv/config";
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log("DATABASE_URL length:", process.env.DATABASE_URL?.length);
if (process.env.DATABASE_URL) {
  console.log("DATABASE_URL prefix:", process.env.DATABASE_URL.substring(0, 10));
}
