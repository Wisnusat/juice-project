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