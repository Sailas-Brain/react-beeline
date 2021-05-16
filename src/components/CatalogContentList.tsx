import React, { useState, useEffect } from 'react'
import { Image, Rate, Pagination } from 'antd';
import { EnvironmentOutlined, CarOutlined, BarChartOutlined } from '@ant-design/icons';
import { TList } from '../models/ListModel'
import { TSort } from '../models/SortModel';

type Prop = {
	productList: TList[];
	sortParams: TSort;
	getKeyFromReviews: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, key: number ) => void
}

export const CatalogContentList: React.FC<Prop> = ({ productList, sortParams, getKeyFromReviews }) => {

	const elemPerPage = 2;
	const [ curPage, setCurPage  ] = useState<number>(0);
	const [ list, setList  ] = useState<TList[]>([]);
	const [ sortedArray, setSortedArray ] = useState<TList[]>([]);

	const setNewList = (products: any) => {
		const startIndex = curPage * elemPerPage;
		const newList = products.slice( startIndex, startIndex + elemPerPage );
		setList(newList);
	}

	useEffect(() => {
		setNewList(productList);
	}, [productList])

	useEffect(() => {
		setNewList(productList);
	}, [productList])

	useEffect(() => {
		if (sortedArray.length) setNewList(sortedArray)
		else setNewList(productList);
	}, [curPage])

	useEffect(() => {
			const newList: TList[] = [...productList]

			const data = newList.sort((a, b) => {
				const firstValue = +( String( a[sortParams.prop] ).replace(/\s/g, '') );
				const secondValue = +( String( b[sortParams.prop] ).replace(/\s/g, '') );
				
				if (firstValue < secondValue) return sortParams.direction === 'desc' ? 1 : -1;
				if (firstValue > secondValue) return sortParams.direction === 'desc' ? -1 : 1;
				return 0;
			});

			setSortedArray(data)
			setNewList(data)
	}, [sortParams])

	const onChangeNav = (page: number) => {
		setCurPage(page - 1);
	}

	return(
		<>

		{list.map(elem => {
			return (
				<div className="container-list" key={elem.key}>
					<div className="wrapper">
						<div className="image-wrapper">
							<Image
								width={elem.image.width}
								height={elem.image.height}
								preview={elem.image.preview}
								src={elem.image.src}
							/>
						</div>
						<div className="block-smartphone">
							<h3>{elem.title}</h3>
							<div className="block-rate">
								<Rate disabled allowHalf defaultValue={elem.rate} />
								<button className="button-rate" onClick={event => getKeyFromReviews( event, elem.key)}>{elem.reviews} отзывов</button>
							</div>
							<div className="container-cdd-to-comparison">
								<BarChartOutlined />
								<button className="cdd-to-comparison" >  Добавить в сравнение</button>
							</div>
							<div className="phone-information">
								<span className="wrapper-information">
									<p>Объем памяти</p>
									<span>{elem.memory}</span>
								</span>
								<span className="wrapper-information">
									<p>Камера </p>
									<span>{elem.camera}</span>
								</span>
								<span className="wrapper-information">
									<p>Экран</p>
									<span>{elem.screen}</span>
								</span>
							</div>

					</div>
					</div>
					<div className="wrapper-price">
						<span className="title-price">{elem.price} P</span>
						<div className="block-buy">
							<button className="button-buy">Купить</button>
							<button className="cdd-to-comparison quick-order" >Быстрый заказ</button>
						</div>
						<div className="block-service">
							<a href="#" className="link-buy">
									<EnvironmentOutlined /> 
									<span>Самовывоз</span>
							</a>
							<a href="#" className="delivery"> 
								<CarOutlined /> 
								<span>Доставка за 2 часа</span>
							</a>
						</div>
					</div>
				</div>
			)
		})
		}

		<div className="container-pagination">
			<Pagination defaultCurrent={ curPage ? curPage : 1 } pageSize={elemPerPage} total={productList.length} onChange={onChangeNav} />
		</div>
        
		</>
	)
}