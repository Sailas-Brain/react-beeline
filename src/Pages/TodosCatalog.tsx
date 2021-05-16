import React, { useState } from 'react';
import { Layout } from 'antd';
import { Filter } from '../components/Filter';
import { CatalogContent } from '../components/CatalogContent';
import { TList } from '../models/ListModel'
import productList from '../mock/ListTotal.json';
import ListReviewsModel from '../mock/ListReviews.json';

export const TodosCatalog: React.FC = () => {
	const [filteredProductList, setFilteredProductList ]= useState<TList[]>(productList)

	const [ listReviews, setListReviews ]= useState<any>(ListReviewsModel);

	const getDataFromFilter = (filteredProductListPrice: TList[]) => {
		setFilteredProductList(filteredProductListPrice)
	}
	const onProductListChange = (filteredProductList: TList[]) => {
		setFilteredProductList(filteredProductList)
	}
	const filterProps = {
		productList, onProductListChange, getDataFromFilter, 
	}
	
	return (
		<Layout className="site-layout-background" style={{ padding: '24px 0' }}>
			<Filter {...filterProps} />
			<CatalogContent productList={filteredProductList} listReviews={listReviews} />
		</Layout>	
	)
}