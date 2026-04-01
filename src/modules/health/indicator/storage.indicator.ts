import { Injectable } from "@nestjs/common";
import { HealthIndicatorService } from "@nestjs/terminus";

export interface StorageIndicatorOptions {
    /** Maximum allowed storage usage in bytes. */
    maxUsageBytes: number;
}