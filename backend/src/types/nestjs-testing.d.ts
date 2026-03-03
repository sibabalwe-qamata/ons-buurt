declare module '@nestjs/testing' {
  import { ModuleMetadata } from '@nestjs/common';
  import { Type } from '@nestjs/common';

  export class Test {
    static createTestingModule(metadata: ModuleMetadata): TestingModuleBuilder;
  }

  export interface TestingModuleBuilder {
    compile(): Promise<TestingModule>;
  }

  export abstract class TestingModule {
    get<T>(typeOrToken: Type<T> | string | symbol): T;
  }
}
