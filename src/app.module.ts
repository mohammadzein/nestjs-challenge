import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule} from '@nestjs/serve-static';
import { join } from 'path';
import { ViolationsModule } from './violations/violations.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client/dist'),
    }),
    ViolationsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
