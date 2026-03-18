import { startServer } from "../index";

export default async (req: any, res: any) => {
  const { app } = await startServer();
  return app(req, res);
};
