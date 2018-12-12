import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { ProductsService } from '../../services/products.service';
import { OrderService } from '../../services/order.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  public products: Product[];
  public categories: string[];

  price: FormControl;
  stock: FormControl;
  category: FormControl;
  filtersForm: FormGroup;

  constructor(
    private router: Router,
    private productsService: ProductsService,
    private orderService: OrderService,
  ) {
    this.products = [];

    this.filtersForm = new FormGroup({
      price: new FormControl(''),
      stock: new FormControl(''),
      category: new FormControl('')
    });
  }

  public ngOnInit(): void {
    this.getCategories();
    this.getProducts();
  }

  public getProducts(): void {
    this.productsService.getAllProducts().
      subscribe((products: Product[]) => {
        this.products = products;
      });
  }

  public getFilteredProducts(): void {

    const filter: { [key: string]: number | string } = {};
    const params: { [key: string]: number | string } = this.filtersForm.value;
    Object.keys(params)
      .filter((item: number | string) => params[item])
      .forEach((item: number | string) => filter[item] = params[item]);

    this.productsService.getAllProducts(filter).subscribe((products: Product[]) => {
      this.products = products;
    });
  }

  public getCategories(): void {
    this.productsService.getCategories().subscribe((categories: string[]) => {
      this.categories = categories;
    });
  }

  public onResetFilters(): void {
    this.filtersForm.reset();
    this.getProducts();
  }

  public onProductDetails(id: string): void {
    this.router.navigate([`products/${id}`]);
  }

  public onAddToCart(product: Product, evt: any): void {
    if (evt && product) {
      evt.stopPropagation();
      this.orderService.createOrder(product);
    }
  }

}
