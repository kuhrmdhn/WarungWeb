"use client"
import React, { Suspense, useCallback, useEffect } from 'react'
import { getSession } from 'next-auth/react'
import { UserStore } from '@/lib/store/userStore'
import { groceryRouter } from '@/lib/database/groceryRouter'
import Loading from '../loading'
import ProductsList from '../../ui/component/ProductList/ProductsList'
import GroceryList from '../../ui/component/GroceryList/GroceryList'
import { ProductsStore } from '@/lib/store/productsStore'
import CashierProductCard from '../../ui/component/ProductList/CashierProductCard'
import { useSearchProduct } from '@/hooks/useSearchProduct'

export default function Cashier() {
  const { setUsername } = UserStore()

  const fetchUserGroceryList = useCallback(async () => {
    const session = await getSession();
    if (session) {
      const username = session.user?.name;
      if (username) {
        groceryRouter.getUserGrocery(username);
        setUsername(username);
      }
    }
  }, [setUsername]);

  useEffect(() => {
    fetchUserGroceryList();
  }, [fetchUserGroceryList]);

  return (
    <Suspense fallback={<Loading />}>
      <ProductsList
        className='grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 justify-items-center gap-y-2 sm:gap-y-7 pt-3'
        renderCard={(product) => <CashierProductCard productData={product} />}
      />
      <GroceryList />
    </Suspense>
  )
}
