import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';



@Injectable({
	providedIn: 'root'
})

export class ErrorInterceptor implements HttpInterceptor {

	constructor() {}

	intercept(
		request: HttpRequest<any>,
		next: HttpHandler): Observable<HttpEvent<any>> {

		return next.handle(request)
				.pipe(
					catchError(
						error => {
							if (error.status === 401) {
								location.reload(true);
							}
							
							const errToThrow = error.error.message || error.statusText;
							return 	throwError(errToThrow);
						})
					);
	}

}