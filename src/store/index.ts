import { z } from "zod";
import { create } from "zustand";

const storeSchema = z
  .object({
    address: z.string(),
  })
  .extend({
    setAddress: z.function().args(z.string(), z.string()),
  });

type Store = z.infer<typeof storeSchema>;

type InitialState = Pick<Store, "address">;

const initialState: InitialState = {
  address: "",
};

const useGlobalStorage = create<Store>((set) => ({
  address: initialState.address,
  setAddress: (address: string) => set({ address }),
}));

export default useGlobalStorage;
