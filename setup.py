from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="uml-diagram-generator",
    version="1.0.0",
    author="SI889 Team",
    author_email="si889@example.com",
    description="Generador de diagramas UML desde JSON - Proyecto SI889",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/tu-usuario/proyecto-si889-2025-i-u3-ticona-martinez-perez",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Topic :: Software Development :: Code Generators",
        "Topic :: Documentation",
    ],
    python_requires=">=3.8",
    install_requires=[
        "fastapi>=0.115.0",
        "uvicorn[standard]>=0.34.0",
        "pydantic>=2.11.0",
        "python-multipart>=0.0.12",
        "SQLAlchemy>=2.0.40",
        "alembic>=1.13.0",
        "asyncpg>=0.30.0",
        "passlib>=1.7.4",
        "PyJWT>=2.10.0",
        "bcrypt>=4.3.0",
        "GitPython>=3.1.40",
        "requests>=2.31.0",
        "python-dotenv>=1.1.0",
        "gunicorn>=21.2.0",
    ],
    extras_require={
        "dev": [
            "pytest>=6.0",
            "pytest-asyncio>=0.15.0",
            "black>=21.0.0",
            "flake8>=3.9.0",
            "mypy>=0.910",
        ],
    },
    entry_points={
        "console_scripts": [
            "uml-generator=uml_generator.main:main",
        ],
    },
    include_package_data=True,
    zip_safe=False,
)
