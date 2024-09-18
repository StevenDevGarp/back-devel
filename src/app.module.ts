import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { SurveyModule } from './survey/survey.module';


@Module({
  imports: [AuthModule, SurveyModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
