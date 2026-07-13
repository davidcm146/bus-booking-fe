export type CustomerUser = {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: "customer";
  readonly operatorId: null;
};

export type OperatorUser = {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: "operator";
  readonly operatorId: string;
};

export type User = CustomerUser | OperatorUser;

export interface AuthSession {
  readonly user: User;
  readonly token: string;
}

export interface SignUpInput {
  readonly name: string;
  readonly email: string;
  readonly password: string;
}

export interface LogInInput {
  readonly email: string;
  readonly password: string;
}
