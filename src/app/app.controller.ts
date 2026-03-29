import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

import { AppService } from './app.service';

@ApiTags('General')
@Controller()
@AllowAnonymous()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    @ApiOkResponse()
    getHello(): string {
        return this.appService.getHello();
    }
}
