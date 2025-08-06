import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto } from 'src/common';
import { catchError } from 'rxjs';
import { RequestGeneric } from 'src/common/request.generic';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject('PRODUCT_SERVICE') private readonly productClient: ClientProxy
  ) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    const request: RequestGeneric<CreateProductDto> = {
      payload: createProductDto,
      correlationId: 'some-correlation-id',
      causationId: 'some-causation-id',
    };
    return this.productClient.send({ cmd: 'create_product' }, request);
  }

  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.productClient.send({ cmd: 'find_all_products' }, pagination);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productClient.send({ cmd: 'find_one_product' }, { id }).pipe(
      catchError(err => {
        // console.error('Error finding product:', err);
        throw new RpcException(err);
      })
    );
    // try {

    //   const product = await firstValueFrom(
    //     this.productClient.send({ cmd: 'find_one_product' },{ id })
    //   );
    //   return product;

    // } catch (error) {
    //   throw new BadRequestException(error);
    // }
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productClient.send({ cmd: 'update_product' }, { id, ...updateProductDto }).pipe(
      catchError(err => {
        throw new RpcException(err);
      })
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productClient.send({ cmd: 'delete_product' }, { id }).pipe(
      catchError(err => {
        throw new RpcException(err);
      })
    );
  }
}
