export interface Friend {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
  balance: number; //+ve they owe you -ve you owe them
}
