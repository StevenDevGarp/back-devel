import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';

@Injectable()
export class SurveyService {
    constructor(private prisma: PrismaService) {}

    async createSurvey(data: any, userId: number) {
        return this.prisma.survey.create({
          data: {
            name: data.name,
            description: data.description,
            creatorId: userId,
            fields: {
              create: data.fields.map(field => ({
                name: field.name,
                type: field.type,
                required: field.required,
              })),
            },
          },
        });
      }
    
      // Listar Encuestas
  async getAllSurveys(userId: number) {
    return this.prisma.survey.findMany({
      where: { creatorId: userId },
      include: { fields: true},
    });
  }

  // Editar Encuesta
  async editSurvey(surveyId: number, data: any, userId: number) {

    // if (!survey || survey.creatorId !== userId) {
    //   throw new Error('Survey not found or unauthorized');
    // }

    return this.prisma.survey.update({
      where: { id: surveyId },
      data: {
        name: data.name,
        description: data.description,
        editorId: userId,
        updatedAt: new Date(),
        fields: {
          deleteMany: {}, 
          create: data.fields.map((field) => ({
            name: field.name,
            type: field.type,
            required: field.required,
          })),
        },
      },
    });
  }

  // Obtener una encuesta por su ID
  async getSurvey(surveyId: number) {
    const survey = await this.prisma.survey.findUnique({
      where: { id: surveyId },
      include: {
        fields: true, // Incluimos los campos de la encuesta
      },
    });

    if (!survey) {
      throw new Error('Survey not found');
    }

    return survey;
  }

  // Ver Respuestas de una Encuesta
  async getSurveyResponses(surveyId: number) {
    return this.prisma.response.findMany({
      where: { surveyId: surveyId },
      select: {
        id: true,
        answers: true,
        createdAt: true,
      },
    });
  }

  // Responder Encuesta
  async answerSurvey(surveyId: number, answers: any) {
    return this.prisma.response.create({
      data: {
        surveyId: surveyId,
        answers: JSON.stringify(answers), // Almacena las respuestas en formato JSON
      },
    });
  }
}
