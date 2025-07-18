export const authorizationService = {
  getAuthorizedEmails(): string[] {
    const config = useRuntimeConfig();
    return (config.public.authorizedEmails || []).map((email: string) =>
      email.trim()
    );
  },

  isEmailAuthorized(email: string): boolean {
    if (!email) return false;
    const authorizedEmails = this.getAuthorizedEmails();
    return authorizedEmails.includes(email.toLowerCase().trim());
  },

  validateUserAuthorization(email: string): {
    isAuthorized: boolean;
    message?: string;
  } {
    if (!email) {
      return {
        isAuthorized: false,
        message: 'Email não fornecido',
      };
    }

    const isAuthorized = this.isEmailAuthorized(email);
    if (!isAuthorized) {
      return {
        isAuthorized: false,
        message: 'Email não autorizado para acessar esta área',
      };
    }

    return { isAuthorized: true };
  },
};
