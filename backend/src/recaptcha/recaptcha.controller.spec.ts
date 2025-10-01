import { Test, TestingModule } from '@nestjs/testing';
import { RecaptchaController } from './recaptcha.controller';
import { RecaptchaService } from './recaptcha.service';

describe('RecaptchaController', () => {
  let controller: RecaptchaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecaptchaController],
      providers: [RecaptchaService],
    }).compile();

    controller = module.get<RecaptchaController>(RecaptchaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
