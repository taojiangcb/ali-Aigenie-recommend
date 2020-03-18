
import { fluentProvide, provide, buildProviderModule } from 'inversify-binding-decorators';
import TAGS from '../constant/Tags';
import TYPES from '../constant/Types';




const provideThrowable = (identifier, name) => {
  return fluentProvide(identifier)
    .whenTargetNamed(name)
    .done();
}

export {
  buildProviderModule,
  provideThrowable,
  TAGS,
  TYPES
}