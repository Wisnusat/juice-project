import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Food {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  tag: string
  vitamins?: string
  weight?: string
  calories?: string
  rating?: number
}

export interface Transaction {
  id: string
  user_id: string
  name: string
  phone: string
  total_price: number
  created_at: string
}

export interface FoodOrder {
  id: string
  transaction_id: string
  food_id: string
  quantity: number
}

export async function getFoods(): Promise<Food[]> {
  const { data, error } = await supabase
    .from('foods')
    .select('*')
  
  if (error) {
    console.error('Error fetching foods:', error)
    return []
  }

  return data || []
}

export async function getFoodById(id: string): Promise<Food | null> {
  const { data, error } = await supabase
    .from('foods')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching food:', error)
    return null
  }

  return data
}

export async function createTransaction(
  name: string,
  phone: string,
  totalPrice: number,
  userId: string,
  foodOrders: { foodId: string; quantity: number }[]
): Promise<{ success: boolean; error?: string }> {
  try {
    // Start a transaction
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert([
        {
          user_id: userId,
          name,
          phone,
          total_price: totalPrice,
          status: 'processing'
        },
      ])
      .select()
      .single()

    if (transactionError) {
      console.error('Transaction error:', transactionError)
      throw transactionError
    }

    // Insert food orders
    const foodOrderData = foodOrders.map(order => ({
      transaction_id: transaction.id,
      food_id: order.foodId,
    }))

    const { error: foodOrderError } = await supabase
      .from('foods_order')
      .insert(foodOrderData)

    if (foodOrderError) throw foodOrderError

    return { success: true }
  } catch (error) {
    console.error('Error creating transaction:', error)
    return { success: false, error: 'Failed to create transaction' }
  }
}

export async function getUserTransactionHistory(userId: string): Promise<{
  foodId: string
  tags: string[]
}[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      foods_order (
        food_id,
        foods (
          tag
        )
      )
    `)
    .eq('user_id', userId)
  
  if (error) {
    console.error('Error fetching user transaction history:', error)
    return []
  }

  return data?.flatMap(transaction => 
    transaction.foods_order.map((order: any) => ({
      foodId: order.food_id,
      tags: order.foods.tag.split(',').map((tag: string) => tag.trim())
    }))
  ) || []
}

export async function searchFoods(query: string): Promise<Food[]> {
  const { data, error } = await supabase
    .from('foods')
    .select('*')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%,tag.ilike.%${query}%`)
  
  if (error) {
    console.error('Error searching foods:', error)
    return []
  }

  return data || []
}

export async function getUserTransactionsWithFoods(userId: string) {
  // Fetch transactions with their foods_order and foods details
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      id,
      created_at,
      total_price,
      name,
      phone,
      status,
      foods_order (
        id,
        food_id,
        foods (
          id,
          name,
          price,
          image
        )
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }

  // Map to UI-friendly structure
  return (data || []).map((tx: any) => ({
    id: tx.id,
    date: new Date(tx.created_at).toLocaleDateString(),
    time: new Date(tx.created_at).toLocaleTimeString(),
    status: tx.status, // You can adjust this if you add status to your table
    items: (tx.foods_order || []).map((fo: any) => ({
      id: fo.foods?.id || fo.food_id,
      name: fo.foods?.name || "Unknown",
      price: fo.foods?.price || 0,
      quantity: 1,
      image: fo.foods?.image || "",
    })),
    totalPrice: tx.total_price,
    deliveryFee: 0, // If you add delivery fee, use it here
    paymentMethod: "QRIS", // If you store payment method, use it here
  }));
}

export async function getAllTransactionsWithFoods() {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      id,
      name,
      phone,
      created_at,
      total_price,
      status,
      foods_order (
        id,
        food_id,
        foods (
          id,
          name,
          price,
          image
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all transactions:', error);
    return [];
  }

  // Map to UI-friendly structure
  return (data || []).map((tx: any) => ({
    id: tx.id,
    customer: {
      name: tx.name,
      phone: tx.phone,
    },
    date: new Date(tx.created_at).toLocaleDateString(),
    time: new Date(tx.created_at).toLocaleTimeString(),
    status: tx.status || "processing",
    items: (tx.foods_order || []).map((fo: any) => ({
      id: fo.foods?.id || fo.food_id,
      name: fo.foods?.name || "Unknown",
      price: fo.foods?.price || 0,
      quantity: fo.quantity || 1,
      image: fo.foods?.image || "",
    })),
    totalPrice: tx.total_price,
    paymentMethod: "QRIS", // Adjust if you have this field
    address: "", // Add if you have this field
    notes: "",   // Add if you have this field
  }));
}

export async function updateTransactionStatus(transactionId: string, status: string) {
  const { error } = await supabase
    .from('transactions')
    .update({ status })
    .eq('id', transactionId);

  if (error) {
    console.error('Error updating transaction status:', error);
    return false;
  }
  return true;
} 