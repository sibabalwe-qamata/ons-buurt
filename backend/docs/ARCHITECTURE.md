# Hexagonal Architecture (Ports & Adapters)

This backend follows **Hexagonal Architecture** (also known as Ports and Adapters), as popularized by Alistair Cockburn and demonstrated in [NestJS hexagonal examples](https://github.com/mguay22/nestjs-hexigonal).

## Overview

Hexagonal architecture isolates the core business logic from external concerns (databases, HTTP, messaging) by defining **ports** (interfaces) that the application depends on, and **adapters** that implement those interfaces. The domain and application layers never depend on infrastructure.

```
                    ┌─────────────────────────────────────┐
                    │           PRESENTATION               │
                    │  (Controllers - Primary Adapters)    │
                    └─────────────────┬───────────────────┘
                                      │ calls
                                      ▼
                    ┌─────────────────────────────────────┐
                    │          APPLICATION                │
                    │  (Use Cases - Business Orchestration)│
                    └─────────────────┬───────────────────┘
                                      │ depends on
                                      ▼
                    ┌─────────────────────────────────────┐
                    │             PORTS                   │
                    │  (Interfaces - Contracts)            │
                    └─────────────────▲───────────────────┘
                                      │ implements
                                      │
                    ┌─────────────────┴───────────────────┐
                    │         INFRASTRUCTURE              │
                    │  (TypeORM Repositories - Adapters)   │
                    └─────────────────────────────────────┘
```

## Folder Structure

Each feature module (bounded context) is organized as:

```
incidents/
├── domain/                    # Pure business objects
│   └── entities/
│       └── incident.entity.ts
├── application/
│   ├── ports/                 # Interfaces (contracts)
│   │   └── incident.repository.port.ts
│   └── use-cases/             # Business orchestration
│       ├── create-incident.use-case.ts
│       ├── list-incidents.use-case.ts
│       └── vouch-incident.use-case.ts
├── infrastructure/
│   ├── persistence/           # TypeORM schemas
│   │   └── incident.schema.ts
│   └── adapters/              # Port implementations
│       └── typeorm-incident.repository.ts
├── presentation/              # HTTP layer (primary adapters)
│   ├── incidents.controller.ts
│   └── dto/
└── incidents.module.ts
```

## Layers

| Layer | Responsibility | Dependencies |
|-------|----------------|--------------|
| **Domain** | Entities, value objects, business rules | None |
| **Application** | Use cases, ports (interfaces) | Domain only |
| **Infrastructure** | Persistence schemas, adapters | Ports, Domain |
| **Presentation** | Controllers, DTOs, HTTP mapping | Use cases |

## Benefits

### 1. **Testability**
Use cases depend only on port interfaces. You can inject in-memory or mock implementations without touching the database.

```typescript
{
  provide: INCIDENT_REPOSITORY,
  useClass: InMemoryIncidentRepository,  
}
```

### 2. **Framework Independence**
The domain and application layers have no dependency on NestJS, TypeORM, or any framework. Business logic can be reused in CLI tools, workers, or other runtimes.

### 3. **Swappable Infrastructure**
Change the database (PostgreSQL → MongoDB), add caching, or switch to a different ORM by implementing the same port. No changes to use cases or controllers.

### 4. **Clear Dependency Direction**
Dependencies point inward: Presentation → Application → Ports ← Infrastructure. The core never depends on the outside.

### 5. **Single Responsibility**
Each use case does one thing. Ports define a narrow contract. Adapters handle one concern (e.g. TypeORM persistence).

### 6. **Easier Refactoring**
Business rules live in use cases. Changing persistence or API shape does not require touching core logic.

### 7. **Team Scalability**
Teams can work on different adapters (e.g. a new GraphQL adapter) without modifying shared use cases.

## Ports and Adapters Pattern

**Port** = Interface that defines *what* the application needs (e.g. "save an incident").

**Adapter** = Implementation that knows *how* to do it (e.g. TypeORM repository, in-memory store).

```typescript
// Port (application/ports/incident.repository.port.ts)
export interface IncidentRepositoryPort {
  save(data: ...): Promise<Incident>;
  findAll(mapType?: IncidentMapType): Promise<Incident[]>;
  findById(id: string): Promise<Incident | null>;
  update(id: string, data: ...): Promise<Incident>;
}

// Adapter (infrastructure/adapters/typeorm-incident.repository.ts)
@Injectable()
export class TypeOrmIncidentRepository implements IncidentRepositoryPort {
  // Implementation using TypeORM
}
```

## Use Case Pattern

Each use case:
- Is `@Injectable()`
- Receives ports via `@Inject(PORT_SYMBOL)`
- Exposes a single `execute()` method
- Contains no framework or infrastructure code

```typescript
@Injectable()
export class CreateIncidentUseCase {
  constructor(
    @Inject(INCIDENT_REPOSITORY)
    private readonly incidentRepository: IncidentRepositoryPort,
  ) {}

  async execute(input: CreateIncidentInput): Promise<Incident> {
    // Pure business logic, no TypeORM, no HTTP
    const map_type = REPORT_TO_MAP_TYPE[input.type] ?? 'warning';
    const title = input.description ? ... : `${input.type} – ${input.location}`;
    return this.incidentRepository.save({ ... });
  }
}
```

## Module Wiring

```typescript
@Module({
  providers: [
    CreateIncidentUseCase,
    ListIncidentsUseCase,
    VouchIncidentUseCase,
    {
      provide: INCIDENT_REPOSITORY,
      useClass: TypeOrmIncidentRepository, 
    },
  ],
})
export class IncidentsModule {}
```

## References

- [nestjs-hexigonal (mguay22)](https://github.com/mguay22/nestjs-hexigonal/blob/main/src/user/application/use-cases/delete-user.use-case.ts)
- [Alistair Cockburn - Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
