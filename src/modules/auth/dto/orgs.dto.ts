import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';

export enum OrgRole {
    Owner = 'owner',
    Admin = 'admin',
    Publisher = 'publisher',
    Contributor = 'contributor',
    Member = 'member',
}

export class CreateOrganizationDto {
    @ApiProperty({ example: 'Acme Corp' })
    @IsString()
    name!: string;

    @ApiProperty({ example: 'acme-corp', description: 'URL-friendly slug' })
    @IsString()
    slug!: string;

    @ApiPropertyOptional({ required: false })
    @IsOptional()
    @IsString()
    logo?: string;

    @ApiPropertyOptional({ required: false })
    @IsOptional()
    @IsObject()
    metadata?: Record<string, any>;
}

export class UpdateOrganizationDto {
    @ApiPropertyOptional({ required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ required: false })
    @IsOptional()
    @IsString()
    logo?: string;

    @ApiPropertyOptional({ required: false })
    @IsOptional()
    @IsObject()
    metadata?: Record<string, any>;
}

export class InviteMemberDto {
    @ApiProperty({ example: 'colleague@example.com' })
    @IsString()
    email!: string;

    @ApiProperty({
        enum: OrgRole,
        default: OrgRole.Member,
        enumName: 'OrgRole',
    })
    @IsEnum(OrgRole)
    role!: OrgRole;

    @ApiProperty({ example: 'org-id' })
    @IsString()
    organizationId!: string;
}

export class UpdateMemberRoleDto {
    @ApiProperty({ enum: OrgRole, enumName: 'OrgRole' })
    @IsEnum(OrgRole)
    role!: OrgRole;

    @ApiProperty({ example: 'member-id' })
    @IsString()
    memberId!: string;

    @ApiProperty({ example: 'org-id' })
    @IsString()
    organizationId!: string;
}

export class RemoveMemberDto {
    @ApiProperty({ example: 'member-id or email' })
    @IsString()
    memberIdOrEmail!: string;

    @ApiProperty({ example: 'org-id' })
    @IsString()
    organizationId!: string;
}

export class CreateTeamDto {
    @ApiProperty({ example: 'Engineering' })
    @IsString()
    name!: string;

    @ApiProperty({ example: 'org-id' })
    @IsString()
    organizationId!: string;
}

export class UpdateTeamDto {
    @ApiProperty({ example: 'team-id' })
    @IsString()
    teamId!: string;

    @ApiProperty({ example: { name: 'New Name', organizationId: 'org-id' } })
    @IsObject()
    data!: { name?: string; organizationId?: string }; // ✅ required, organizationId moved inside
}

export class TeamMemberDto {
    @ApiProperty({ example: 'team-id' })
    @IsString()
    teamId!: string;

    @ApiProperty({ example: 'user-id' })
    @IsString()
    userId!: string;

    @ApiProperty({ example: 'org-id' })
    @IsString()
    organizationId!: string;
}

export class HasPermissionDto {
    @ApiProperty({ example: 'org-id' })
    @IsString()
    organizationId!: string;

    @ApiProperty({ example: { member: ['create'] } })
    @IsObject()
    permissions!: Record<string, string[]>;
}
