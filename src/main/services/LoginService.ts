import { BaseService } from './BaseService'
import { Inject, Service } from './Service'
import { Logger } from '/@main/logger'
import users from '/@main/data/users';
import crypto from 'crypto'

export class LoginService extends Service {
  @Inject('BaseService')
  private baseService!: BaseService

  constructor(logger: Logger) {
    super(logger);
  }

  /**
   * Example for inject and shared lib
   */
  async signIn(userName: string, password: string) {
    console.log('signIn received ', userName);
    const user = users.find(user => user.userName === userName);
    // compare password using SHA256

    const hashedPassword = crypto.createHash('md5').update(password).digest('hex')
    if (user && user.password === hashedPassword) {
      return user
    }
    return null;
  }
}
