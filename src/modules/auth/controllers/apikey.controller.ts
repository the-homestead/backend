import { Controller, UseFilters, Get, Req, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { CreateApiKeyDto, UpdateApiKeyDto } from '../dto';
import { BetterAuthExceptionFilter } from '../filters/better-auth-exception.filter';
import { AuthResponseHelper } from '../helpers/auth-response.helper';
import { ApiKeyService } from '../services';
import type { Request } from 'express';

@ApiTags('API Keys')
@Controller('auth/api-keys')
@UseFilters(BetterAuthExceptionFilter)
export class ApiKeyController {
    constructor(
        private readonly apiKeyService: ApiKeyService,
        private readonly authResponse: AuthResponseHelper,
    ) {}

    @Get()
    @ApiOperation({ summary: 'List all API keys for the current user' })
    @ApiResponse({ status: 200 })
    async list(@Req() req: Request) {
        return this.authResponse.handle(await this.apiKeyService.listApiKeys(req));
    }

    @Post()
    @ApiOperation({ summary: 'Create a new API key' })
    @ApiBody({ type: CreateApiKeyDto })
    @ApiResponse({
        status: 200,
        description: 'Key returned. The raw key value is only shown once.',
    })
    async create(@Body() body: CreateApiKeyDto, @Req() req: Request) {
        return this.authResponse.handle(await this.apiKeyService.createApiKey(body, req));
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get API key metadata by ID' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 200 })
    async getOne(@Param('id') id: string, @Req() req: Request) {
        return this.authResponse.handle(await this.apiKeyService.getApiKey({ id }, req));
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an API key' })
    @ApiParam({ name: 'keyId' })
    @ApiBody({ type: UpdateApiKeyDto })
    @ApiResponse({ status: 200 })
    async update(@Param('id') keyId: string, @Body() body: UpdateApiKeyDto, @Req() req: Request) {
        return this.authResponse.handle(
            await this.apiKeyService.updateApiKey({ keyId, ...body }, req),
        );
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an API key' })
    @ApiParam({ name: 'keyId' })
    @ApiResponse({ status: 200 })
    async remove(@Param('id') keyId: string, @Req() req: Request) {
        return this.authResponse.handle(await this.apiKeyService.deleteApiKey({ keyId }, req));
    }
}
