import { Controller, UseGuards, Body, Post, Req, Param, Get, Put } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { SurveyService } from './survey.service';
import { Public } from 'src/auth/jwt/public.decorator';

@Controller('survey')
@UseGuards(JwtGuard)
export class SurveyController {
    constructor(private surveyService: SurveyService) {}
    
    @Post()
    async createSurvey(@Body() data: any, @Req() req: any) {
        console.log(req.user);
        return this.surveyService.createSurvey(data, req.user.userId);
    }
      // Listar Encuestas
    @Get()
    async getAllSurveys(@Req() req: any) {
        return this.surveyService.getAllSurveys(req.user.userId);
    }

    // Encuesta a Responder
    // Endpoint para obtener una encuesta por su ID
    @Public() // Decorador para que sea público
    @Get(':id/require-response')
    async getSurvey(@Param('id') surveyId: string) {
        return this.surveyService.getSurvey(Number(surveyId)); // Asegúrate de convertir el ID a número
    }

    // Editar Encuesta 
    @Put(':id')
    async editSurvey(@Param('id') surveyId: number, @Body() data: any, @Req() req: any) {
        return this.surveyService.editSurvey(Number(surveyId), data, req.user.userId);
    }

    // Ver Respuestas 
    @Get(':id/responses')
    async getSurveyResponses(@Param('id') surveyId: number) {
        return this.surveyService.getSurveyResponses(Number(surveyId));
    }
    
    // Responder Encuesta -- listo
    @Public()
    @Post(':id/response')
    async answerSurvey(@Param('id') surveyId: string, @Body() answers: any) {
        return this.surveyService.answerSurvey(Number(surveyId), answers); // Convertimos surveyId a un número
    }

}


