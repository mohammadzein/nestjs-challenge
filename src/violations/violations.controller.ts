import { Controller, Get, Post, Body } from '@nestjs/common';
import { ViolationsService } from './violations.service';
import { ViolationDto } from './violation.dto';

@Controller('violations')
export class ViolationsController {
    constructor(private violationsService: ViolationsService) { }

    @Get()
    async init() {
        const data = await this.violationsService.init();
        return data;
    }

    @Post()
    async filtered(@Body() violation: ViolationDto) {
        const violations = await this.violationsService.filtered(violation);
        return violations;
    }

}
