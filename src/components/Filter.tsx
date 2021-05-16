import React, { useEffect, useMemo, useState } from 'react'
import { Checkbox, Input, Col, Row, Layout, Menu, Slider } from 'antd';
import { TList } from '../models/ListModel';

type TFilterProps = {
	productList: TList[]
	onProductListChange: (productList: TList[]) => void
	getDataFromFilter: (productListPrice: TList[]) => void
}

export const Filter: React.FC<TFilterProps> = ({ productList, onProductListChange, getDataFromFilter }) => {

	const getData = () => {
		const data = productList.sort((a, b) => {
			const firstValue = +( String( a.price  ).replace(/\s/g, '') );
			const secondValue = +( String( b.price ).replace(/\s/g, '') );
			
			if (firstValue < secondValue) return 1;
			if (firstValue > secondValue) return -1;

			return 0;
		})

		const firstValue = +( String( data[data.length - 1].price  ).replace(/\s/g, '') );
		const secondValue = +( String( data[0].price  ).replace(/\s/g, '') );

		return [firstValue, secondValue]
	}

	const getUniquePromos = (propName: 'promo' | 'color') => {
		const allProps = productList.map(elem => JSON.stringify(elem[propName]));
		return Array.from(new Set(allProps)).map(elem => JSON.parse(elem));
	} 
	
	const [minDefaultValueSlider, setMinDefaultValueSlider] = useState<number>(getData()[0]);
	const [maxDefaultValueSlider, setMaxDefaultValueSlider] = useState<number>(getData()[1]);

	const [minValueSlider, setMinValueSlider] = useState<number>(getData()[0]);
	const [maxValueSlider, setMaxValueSlider] = useState<number>(getData()[1]);

	const [minInputValue, setMinInputValue] = useState<number>(getData()[0]);
	const [maxInputValue, setMaxInputValue] = useState<number>(getData()[1]);

	const [promoValues, setPromosValue] = useState<any>( () => getUniquePromos('promo') );
	const [colorValues, setColorValue] = useState<any>( () => getUniquePromos('color') );

	const getActiveProps = (propArr: any) => {
		const activeProps: string[] = [];
		propArr.forEach((prop: any) => {
			(prop.isActive === true) && activeProps.push(prop.label);
		});
		return activeProps;
	};

	const getIsActiveCopy = (propsArr: any, activeArr: any) => {
		return JSON.parse(JSON.stringify(propsArr)).map((el: any) => {
			el.isActive = activeArr.includes(el.label);
			return el;
		});
	}

	const getFilteredProductList = ({ promoValues = [], colorValues = []}: { promoValues: any, colorValues: any }) => {
		let productListCopy: TList[] = [...productList];
		
		const activePromos = getActiveProps(promoValues);
		if (activePromos.length) productListCopy = productListCopy.filter(elem => activePromos.includes(elem.promo.label));

		const activeColors = getActiveProps(colorValues);
		if (activeColors.length) productListCopy = productListCopy.filter(elem => activeColors.includes(elem.color.label));

		return productListCopy;
	};

	const getUsedProps = (productList: any, prop: any) => {
		const productProps: string[] = [];
		productList.forEach((product: any) => {
			(!productProps.includes(product.color.label)) && productProps.push(product[prop].label);
		})
		return productProps;
	};

	const getFilteredCategory = (propValue: any, usedProps: any, otherActiveProps: any) => {
		const propCopy = JSON.parse(JSON.stringify(propValue));
		propCopy.map((color: any) => {
			color.isDisabled = false;
			if (!color.isActive && otherActiveProps.length && !usedProps.includes(color.label)) color.isDisabled = true;
			return color;
		})
		return propCopy;
	}

	const handleChangePromoValues = (activeArr: any) => {
		const promosCopy = getIsActiveCopy(promoValues, activeArr);
		setPromosValue(promosCopy);

		const filteredProductList = getFilteredProductList({ promoValues: promosCopy, colorValues });
		onProductListChange(filteredProductList);

		const usedColors = getUsedProps(filteredProductList, 'color');
		const activePromos = getActiveProps(promosCopy);
		const colorsCopy = getFilteredCategory(colorValues, usedColors, activePromos);
		setColorValue(colorsCopy);
	}

	const handleChangeColorValues = (activeArr: any) => {
		const colorsCopy = getIsActiveCopy(colorValues, activeArr);
		setColorValue(colorsCopy);

		const filteredProductList = getFilteredProductList({ promoValues, colorValues: colorsCopy });
		onProductListChange(filteredProductList);
		
		const usedPromos = getUsedProps(filteredProductList, 'promo');
		const activeColors = getActiveProps(colorsCopy);
		const promosCopy = getFilteredCategory(promoValues, usedPromos, activeColors);
		setPromosValue(promosCopy);
	}
	const sortPrice = (value: any) => {
		const newList: TList[] = [...productList];
		const dataValue = value;

			if(dataValue.length > 0) {
				const data = newList.filter(elem => {
				const price = +( String( elem.price ).replace(/\s/g, '') );
				const lastValue =  dataValue[0];
				const secondValue =  dataValue[1];
				if(price >= lastValue && price <= secondValue) {
					return elem
				} else {
					return false
				}
			})
			
			getDataFromFilter(data)
		}
	}

	const marks = {
		9990: minDefaultValueSlider,
		43890: maxDefaultValueSlider
	};

	const onChangeMinValueInput = (event: any) => {
		const value = +event.target.value.replace(/[^+\d]/g, '');
		const data = [value, maxValueSlider];
		
		if(value > maxValueSlider) {
			setMinValueSlider(minValueSlider);
			setMinInputValue(minValueSlider);
		} else {
			setMinValueSlider(value);
			setMinInputValue(value);

			sortPrice(data);
		}
	}

	const onChangeMaxValueInput = (event: any) => {
		const value = +event.target.value.replace(/[^+\d]/g, '');
		const data = [minValueSlider, value];

		if(value > maxDefaultValueSlider) {
			setMaxValueSlider(maxValueSlider);
			setMaxInputValue(maxValueSlider);
		} else if(value < minValueSlider) {
			setMaxInputValue(value);
			setMaxValueSlider(maxDefaultValueSlider);
			sortPrice([minValueSlider, maxDefaultValueSlider]);
		} else {
			setMaxValueSlider(value);
			setMaxInputValue(value);

			sortPrice(data);
		}
	}

	const onChangeToggle = (value: any) => {
		const dataValue = value;

		sortPrice(dataValue);

		setMinValueSlider(dataValue[0]);
		setMinInputValue(dataValue[0]);
		setMaxValueSlider(dataValue[1]);
		setMaxInputValue(dataValue[1]);

	}

	const { SubMenu } = Menu;
	const { Sider } = Layout;

	return (
		<>
			<Sider className="site-layout-background" width={251}>
				<Menu
					mode="inline"
					defaultSelectedKeys={['1']}
					defaultOpenKeys={['sub1', 'sub2', 'sub3']}
					style={{ height: '100%' }}
				>
					
					<SubMenu key="sub1" title="Цена">
						<Slider
							range
							min={minDefaultValueSlider}
							max={maxDefaultValueSlider}
							value={[minValueSlider, maxValueSlider]}
							marks={marks}
							onChange={(value) => onChangeToggle(value)}
						/>

						<Input.Group size="large" style={{ padding: '24px 0 0 0' }}>
							<Row gutter={20}>
								<Col span={12}>
									<Input placeholder={String(minValueSlider)} value={minInputValue} onChange={onChangeMinValueInput}/>
								</Col>
								<Col span={12}>
									<Input placeholder={String(maxValueSlider)} value={maxInputValue} onChange={onChangeMaxValueInput}/>
								</Col>
							</Row>
						</Input.Group>
					</SubMenu>
					<SubMenu key="sub2" title="Акция">
						<Checkbox.Group 
							onChange={handleChangePromoValues}
							style={{width: '100%'}}
						>
						<Row style={{
							display: 'flex', 
							flexDirection: 'column',
							flexWrap: 'unset',
							width: '100%',
						}}>
							{promoValues.map((elem: any) => (
								<Col span={24}>
									<Checkbox value={elem.label} disabled={elem.isDisabled}>{elem.label}</Checkbox>
								</Col>
							))}
						</Row>
					</Checkbox.Group>
					</SubMenu>
					<SubMenu key="sub3" title="Цвет">
					<Checkbox.Group
						onChange={handleChangeColorValues}
						style={{ width: '100%'}}
					>
						<Row style={{ 
							display: 'flex', 
							flexDirection: 'column',
							flexWrap: 'unset',
							width: '100%',
						}}>
							{colorValues.map((elem: any) => (
								<Col span={24}>
									<Checkbox value={elem.label} disabled={elem.isDisabled}> <i className={elem.color} style={{background: elem.color}}></i> {elem.label}</Checkbox>
								</Col>
							))}
						</Row>
					</Checkbox.Group>
					</SubMenu>
				</Menu>
			</Sider>
		</>
	)
}