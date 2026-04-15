import { AppDataSource } from "./database";

export const migrateDatabase = async () => {
  const queryRunner = AppDataSource.createQueryRunner();

  try {
    console.log("Running migrations...");

    // Drop recommendations table if it exists to recreate with correct schema
    await queryRunner.dropTable("recommendations", true);
    console.log("Dropped recommendations table");

    // Sync the database schema
    // This will:
    // 1. Recreate the recommendations table with created_at column
    // 2. Add assessmentCount column to users if it doesn't exist
    await AppDataSource.synchronize();
    console.log("Database schema synchronized");

  } catch (error) {
    console.error("Migration error:", error);
    throw error;
  } finally {
    await queryRunner.release();
  }
};
